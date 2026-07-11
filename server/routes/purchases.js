import { Router } from 'express';
import Compra from '../models/Purchase.js';
import ElementoBiblioteca from '../models/LibraryItem.js';
import Transaccion from '../models/Transaction.js';
import Libro from '../models/Book.js';
import { middlewareAuth } from '../middleware/auth.js';

const router = Router();

function generarIdTransaccion() {
  return 'TXN-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8).toUpperCase();
}

router.post('/', middlewareAuth, async (req, res) => {
  try {
    const { bookId, paymentMethod } = req.body;
    const libro = await Libro.findById(bookId);
    if (!libro) return res.status(404).json({ message: 'Libro no encontrado' });

    const existente = await Compra.findOne({ user: req.user.id, book: bookId });
    if (existente) return res.status(400).json({ message: 'Ya compraste este libro' });

    const idTransaccion = generarIdTransaccion();

    const compra = await Compra.create({
      user: req.user.id,
      book: bookId,
      amount: libro.price,
      paymentMethod: paymentMethod || 'Tarjeta de crédito',
      transactionId: idTransaccion,
    });

    const elemBiblioteca = await ElementoBiblioteca.findOne({ user: req.user.id, book: bookId });
    if (!elemBiblioteca) {
      await ElementoBiblioteca.create({ user: req.user.id, book: bookId, purchaseType: 'permanent' });
    } else {
      elemBiblioteca.purchaseType = 'permanent';
      await elemBiblioteca.save();
    }

    await Transaccion.create({
      user: req.user.id,
      type: 'purchase',
      amount: libro.price,
      description: `Compra: ${libro.title}`,
      paymentMethod: paymentMethod || 'Tarjeta de crédito',
      transactionId: idTransaccion,
    });

    const poblada = await compra.populate('book');
    res.status(201).json(poblada);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

router.get('/', middlewareAuth, async (req, res) => {
  try {
    const compras = await Compra.find({ user: req.user.id })
      .populate('book', 'title author coverUrl genre')
      .sort('-createdAt');
    res.json(compras);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

export default router;
