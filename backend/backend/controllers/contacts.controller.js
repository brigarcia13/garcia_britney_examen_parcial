import Contact from '../models/contact.model.js';
import mongoose from 'mongoose';

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({}, '-__v').sort({ createdAt: -1 });
    return res.status(200).json(contacts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Error al obtener contactos' });
  }
};

export const getContactById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ msg: 'ID inválido' });

  try {
    const contact = await Contact.findById(id, '-__v');
    if (!contact) return res.status(404).json({ msg: 'Contacto no encontrado' });
    return res.status(200).json(contact);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Error al buscar contacto' });
  }
};

export const createContact = async (req, res) => {
  const { nombre, apellido, email, telefono, nota } = req.body;
  if (!nombre || !apellido || !email) {
    return res.status(400).json({ msg: 'nombre, apellido y email son obligatorios' });
  }

  try {
    const newContact = new Contact({ nombre, apellido, email, telefono, nota });
    const saved = await newContact.save();
    return res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Error al crear contacto' });
  }
};

export const updateContact = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ msg: 'ID inválido' });

  try {
    const updated = await Contact.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ msg: 'Contacto no encontrado' });
    return res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Error al actualizar contacto' });
  }
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ msg: 'ID inválido' });

  try {
    const deleted = await Contact.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ msg: 'Contacto no encontrado' });
    return res.status(200).json({ msg: 'Contacto eliminado' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Error al eliminar contacto' });
  }
};
