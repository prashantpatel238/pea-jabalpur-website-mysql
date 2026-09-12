const { buildPage } = require("../utils/page");
const { listGalleryImages, findGalleryImageById, createGalleryImage, updateGalleryImage, deleteGalleryImage } = require("../repositories/galleryRepository");
const { getGalleryPath, removeGalleryImage } = require("../middleware/galleryUpload");
const fallback = [
  { title: "Engineers' Day", caption: "Association members celebrating engineering excellence.", image_path: "/images/home/home-hero-engineers-day.jpeg" },
  { title: "Professional Networking", caption: "Members connecting at an association gathering.", image_path: "/images/home/professional-networking.jpeg" },
  { title: "Knowledge Sharing", caption: "Learning together through professional activities.", image_path: "/images/home/knowledge-sharing.jpeg" },
  { title: "Member Recognition", caption: "Recognising contributions to the engineering community.", image_path: "/images/about/about-member-recognition.jpeg" }
];
async function renderGallery(req, res) { const records = await listGalleryImages({ activeOnly: true }); res.render("public/gallery", { page: buildPage("/gallery", "Gallery"), images: records.length ? records : fallback }); }
async function renderAdminGallery(req, res) { res.render("admin/gallery", { page: buildPage("/admin/gallery", "Manage Gallery"), images: await listGalleryImages() }); }
function payload(req, oldPath = "") { return { title: String(req.body.title || "").trim(), caption: String(req.body.caption || "").trim(), image_path: getGalleryPath(req.file) || oldPath, event_date: req.body.event_date || null, display_order: Math.max(0, Number.parseInt(req.body.display_order, 10) || 0), is_active: req.body.is_active ? 1 : 0 }; }
async function handleCreate(req, res) { if (req.galleryUploadError || !req.file || !String(req.body.title || "").trim()) { if (req.file) removeGalleryImage(getGalleryPath(req.file)); req.session.flash={type:"error",message:req.galleryUploadError || "A title and image are required."}; return res.redirect("/admin/gallery"); } await createGalleryImage(payload(req)); req.session.flash={type:"success",message:"Gallery image added."}; res.redirect("/admin/gallery"); }
async function handleUpdate(req, res) { const existing=await findGalleryImageById(req.params.id); if (!existing) return res.redirect("/admin/gallery"); if (req.galleryUploadError) { req.session.flash={type:"error",message:req.galleryUploadError}; return res.redirect("/admin/gallery"); } const item=payload(req,existing.image_path); await updateGalleryImage(req.params.id,item); if(req.file) removeGalleryImage(existing.image_path); req.session.flash={type:"success",message:"Gallery image updated."}; res.redirect("/admin/gallery"); }
async function handleDelete(req,res) { const existing=await findGalleryImageById(req.params.id); if(existing){ await deleteGalleryImage(req.params.id); removeGalleryImage(existing.image_path); } req.session.flash={type:"success",message:"Gallery image deleted."}; res.redirect("/admin/gallery"); }
module.exports={renderGallery,renderAdminGallery,handleCreate,handleUpdate,handleDelete};
