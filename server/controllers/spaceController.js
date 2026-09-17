import Space from '../models/Space.js';
import Testimonial from '../models/Testimonial.js';
const slugify = value => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
export async function listSpaces(req, res) { res.json(await Space.find({ owner: req.user._id }).sort('-createdAt')); }
export async function createSpace(req, res) { const base = slugify(req.body.slug || req.body.name); const exists = await Space.findOne({ slug: base }); if (exists) return res.status(409).json({ message: 'Slug already in use' }); const space = await Space.create({ ...req.body, name: req.body.name, slug: base, owner: req.user._id }); res.status(201).json(space); }
export async function getSpace(req, res) { const space = await Space.findOne({ _id: req.params.id, owner: req.user._id }); if (!space) return res.status(404).json({ message: 'Space not found' }); res.json(space); }
export async function updateSpace(req, res) { const space = await Space.findOneAndUpdate({ _id: req.params.id, owner: req.user._id }, req.body, { new: true }); if (!space) return res.status(404).json({ message: 'Space not found' }); res.json(space); }
export async function deleteSpace(req, res) { await Space.deleteOne({ _id: req.params.id, owner: req.user._id }); res.json({ message: 'Space deleted' }); }
export async function publicSpace(req, res) { const space = await Space.findOne({ slug: req.params.slug }); if (!space) return res.status(404).json({ message: 'Collection not found' }); res.json(space); }
export async function publicWall(req, res) { const space = await Space.findOne({ slug: req.params.slug }); if (!space) return res.status(404).json({ message: 'Collection not found' }); res.json({ space, testimonials: await Testimonial.find({ space: space._id, status: 'Approved' }).sort('-isFeatured -createdAt') }); }
