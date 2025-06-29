import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import React, { useState } from "react";

interface MenuItem {
   id: string;
   label: string;
   url: string;
}

const initialMenus: MenuItem[] = [
   { id: "1", label: "Home", url: "/" },
   { id: "2", label: "About", url: "/about" },
];

const MenuBuilder: React.FC = () => {
   const [menus, setMenus] = useState<MenuItem[]>(initialMenus);
   const [form, setForm] = useState({ label: "", url: "" });
   const [editingId, setEditingId] = useState<string | null>(null);
   const [settingsOpen, setSettingsOpen] = useState(false);

   // Add or update menu
   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!form.label || !form.url) return;
      if (editingId) {
         setMenus(menus.map((m) => (m.id === editingId ? { ...m, ...form } : m)));
         setEditingId(null);
      } else {
         setMenus([...menus, { ...form, id: Date.now().toString() }]);
      }
      setForm({ label: "", url: "" });
   };

   // Edit menu
   const handleEdit = (item: MenuItem) => {
      setForm({ label: item.label, url: item.url });
      setEditingId(item.id);
   };

   // Delete menu
   const handleDelete = (id: string) => {
      setMenus(menus.filter((m) => m.id !== id));
      if (editingId === id) {
         setEditingId(null);
         setForm({ label: "", url: "" });
      }
   };

   // Drag and drop
   const onDragEnd = (result: any) => {
      if (!result.destination) return;
      const items = Array.from(menus);
      const [reordered] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reordered);
      setMenus(items);
   };

   return (
      <div className="max-w-2xl mx-auto py-8">
         <h2 className="text-2xl font-bold text-white mb-4">Menu Builder</h2>

         {/* Menu Settings */}
         <button
            className="mb-4 px-3 py-1 bg-gray-700 text-white rounded"
            onClick={() => setSettingsOpen(!settingsOpen)}
         >
            {settingsOpen ? "Hide" : "Show"} Menu Settings
         </button>
         {settingsOpen && (
            <div className="bg-gray-800 p-4 rounded mb-6">
               <h3 className="text-lg font-semibold mb-2">Menu Settings</h3>
               {/* Add your menu settings fields here */}
               <div className="text-gray-400">Settings panel (e.g. menu name, location, etc.)</div>
            </div>
         )}

         {/* Add/Edit Form */}
         <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
            <input
               type="text"
               placeholder="Label"
               value={form.label}
               onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
               className="px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white flex-1"
            />
            <input
               type="text"
               placeholder="URL"
               value={form.url}
               onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
               className="px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white flex-1"
            />
            <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">
               {editingId ? "Update" : "Add"}
            </button>
            {editingId && (
               <button
                  type="button"
                  className="px-3 py-2 bg-gray-600 text-white rounded"
                  onClick={() => {
                     setEditingId(null);
                     setForm({ label: "", url: "" });
                  }}
               >
                  Cancel
               </button>
            )}
         </form>

         {/* Menu List with Drag-and-Drop */}
         <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="menu-list">
               {(provided) => (
                  <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                     {menus.map((item, idx) => (
                        <Draggable key={item.id} draggableId={item.id} index={idx}>
                           {(provided) => (
                              <li
                                 ref={provided.innerRef}
                                 {...provided.draggableProps}
                                 className="flex items-center bg-gray-800 rounded px-4 py-2"
                              >
                                 <span {...provided.dragHandleProps} className="cursor-move mr-3 text-gray-400">
                                    ☰
                                 </span>
                                 <span className="flex-1 text-white">
                                    {item.label} <span className="text-gray-400 text-sm">({item.url})</span>
                                 </span>
                                 <button className="text-blue-400 mr-2" onClick={() => handleEdit(item)}>
                                    Edit
                                 </button>
                                 <button className="text-red-400" onClick={() => handleDelete(item.id)}>
                                    Delete
                                 </button>
                              </li>
                           )}
                        </Draggable>
                     ))}
                     {provided.placeholder}
                  </ul>
               )}
            </Droppable>
         </DragDropContext>
      </div>
   );
};

export default MenuBuilder;
