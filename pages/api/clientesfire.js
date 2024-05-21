import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore'; // Note que 'Firestore' é substituído por 'firestore'
import { database } from '../../services/firebase';

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const querySnapshot = await getDocs(collection(database, "clientes"));
        const clientes = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        res.status(200).json(clientes);
      } catch (e) {
        console.error("Erro ao buscar cliente:", e);
        res.status(500).json({ error: "Erro ao buscar cliente" });
      }
      break;

    case 'POST':
      const { cpf, telefone } = req.body;
      try {
        const docRef = await addDoc(collection(database, "clientes"), {
          cpf: cpf,
          telefone: telefone,
        });
        res.status(200).json({ id: docRef.id });
      } catch (e) {
        console.error("Erro ao adicionar cliente:", e);
        res.status(500).json({ error: "Erro ao adicionar cliente" });
      }
      break;

    case 'PUT':
      const { id, cpf: cpfAtualizado, telefone: telefoneAtualizado } = req.body;
      try {
        const docRef = doc(database, "clientes", id);
        await updateDoc(docRef, {
          cpf: cpfAtualizado,
          telefone: telefoneAtualizado,
        });
        res.status(200).json({ message: "Cliente atualizado com sucesso" });
      } catch (e) {
        console.error("Erro ao atualizar cliente:", e);
        res.status(500).json({ error: "Erro ao atualizar cliente" });
      }
      break;

    case 'DELETE':
      const { id: idExcluir } = req.body;
      try {
        const docRef = doc(database, "clientes", idExcluir);
        await deleteDoc(docRef);
        res.status(200).json({ message: "Cliente excluído com sucesso" });
      } catch (e) {
        console.error("Erro ao excluir cliente:", e);
        res.status(500).json({ error: "Erro ao excluir cliente" });
      }
      break;

    default:
      res.status(405).json({ error: "Método não permitido" });
      break;
  }
}
