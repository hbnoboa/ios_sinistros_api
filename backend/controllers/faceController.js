const User = require("../models/userModel");
const faceapi = require("face-api.js");
const canvas = require("canvas");
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// Carregue os modelos uma vez ao iniciar
const MODEL_PATH = "./models/face";
let modelsLoaded = false;
async function loadModels() {
  if (!modelsLoaded) {
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_PATH);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_PATH);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_PATH);
    modelsLoaded = true;
  }
}

// Função para extrair o descritor facial de um buffer de imagem
async function getFaceDescriptor(buffer) {
  await loadModels();
  const img = await canvas.loadImage(buffer);
  const detections = await faceapi
    .detectSingleFace(img)
    .withFaceLandmarks()
    .withFaceDescriptor();
  if (!detections || !detections.descriptor)
    throw new Error("Rosto não detectado");
  return Array.from(detections.descriptor);
}

// Função para comparar dois descritores (distância euclidiana)
function compareDescriptors(descriptor1, descriptor2) {
  if (!descriptor1 || !descriptor2) return 1;
  let sum = 0;
  for (let i = 0; i < descriptor1.length; i++) {
    sum += Math.pow(descriptor1[i] - descriptor2[i], 2);
  }
  return Math.sqrt(sum);
}

exports.faceLogin = async (req, res) => {
  try {
    const { email } = req.body;
    if (!req.file || !email)
      return res.status(400).json({ error: "Imagem e email são obrigatórios" });

    const user = await User.findOne({ email });
    if (!user || !user.faceDescriptor)
      return res
        .status(404)
        .json({ error: "Usuário não encontrado ou sem face cadastrada" });

    const descriptor = await getFaceDescriptor(req.file.buffer);
    const distance = compareDescriptors(descriptor, user.faceDescriptor);

    // Adicione este log para depuração:
    console.log("Comparando descritores:");
    console.log("Novo descritor:", descriptor);
    console.log("Descritor salvo:", user.faceDescriptor);
    console.log("Distância euclidiana:", distance);

    if (distance < 0.5) {
      return res.json({
        success: true,
        message: "Reconhecimento facial aprovado",
        userId: user._id,
      });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Rosto não reconhecido" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.faceRegister = async (req, res) => {
  try {
    const { email } = req.body;
    if (!req.file || !email)
      return res.status(400).json({ error: "Imagem e email são obrigatórios" });

    const descriptor = await getFaceDescriptor(req.file.buffer);

    const user = await User.findOneAndUpdate(
      { email },
      { faceDescriptor: descriptor },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    res.json({ success: true, message: "Face cadastrada com sucesso" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
