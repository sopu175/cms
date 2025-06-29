import MediaUploadButton from "../components/MediaUploadButton"; // Adjust import as needed
import SectionEditor from "../components/SectionEditor"; // Reuse your Post Section tab component
import { useCategories } from "../hooks/useCategories";

const Categories: React.FC = () => {
   const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
   const [editingCategory, setEditingCategory] = useState<Category | null>(null);
   const [formData, setFormData] = useState({
      name: "",
      description: "",
      color: "#3B82F6",
      parent_id: "",
      featured_image: "",
      sections: [],
   });

   useEffect(() => {
      if (editingCategory) {
         setFormData({
            name: editingCategory.name,
            description: editingCategory.description || "",
            color: editingCategory.color || "#3B82F6",
            parent_id: editingCategory.parent_id || "",
            featured_image: editingCategory.featured_image || "",
            sections: editingCategory.sections || [],
         });
      } else {
         setFormData({
            name: "",
            description: "",
            color: "#3B82F6",
            parent_id: "",
            featured_image: "",
            sections: [],
         });
      }
   }, [editingCategory]);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (editingCategory) {
         await updateCategory(editingCategory.id, formData);
      } else {
         await addCategory(formData);
      }
      setEditingCategory(null);
   };

   return (
      <form onSubmit={handleSubmit}>
         {/* ...other fields... */}

         {/* Parent Category Dropdown */}
         <div>
            <label>Parent Category</label>
            <select
               value={formData.parent_id}
               onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
            >
               <option value="">None</option>
               {categories
                  .filter((cat) => !editingCategory || cat.id !== editingCategory.id)
                  .map((cat) => (
                     <option key={cat.id} value={cat.id}>
                        {cat.name}
                     </option>
                  ))}
            </select>
         </div>

         {/* Featured Image Upload */}
         <div>
            <label>Featured Image</label>
            <MediaUploadButton
               value={formData.featured_image}
               onChange={(url) => setFormData({ ...formData, featured_image: url })}
            />
            {formData.featured_image && (
               <img src={formData.featured_image} alt="Featured" style={{ maxWidth: 120, marginTop: 8 }} />
            )}
         </div>

         {/* Sections Editor (reuse Post Section tab) */}
         <div>
            <label>Sections</label>
            <SectionEditor
               sections={formData.sections}
               onChange={(sections) => setFormData({ ...formData, sections })}
            />
         </div>

         {/* ...other fields and submit button... */}
      </form>
   );
};

export default Categories;
