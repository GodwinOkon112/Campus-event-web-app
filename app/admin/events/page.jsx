"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Loader2, Trash2, Pencil, X } from "lucide-react";

export default function CreateMatchPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    price: "",
    status: "Upcoming",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState([]);
  const [fetching, setFetching] = useState(false);

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [updating, setUpdating] = useState(false);

  const fetchMatches = async () => {
    setFetching(true);
    try {
      const res = await fetch("/api/events"); // still points to /events backend
      const data = await res.json();
      setMatches(data);
    } catch (error) {
      toast.error("Failed to load matches");
    }
    setFetching(false);
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        toast.success("✅ Match created successfully!");
        setForm({
          title: "",
          description: "",
          date: "",
          time: "",
          price: "",
          status: "Upcoming",
          image: null,
        });
        fetchMatches();
      } else {
        toast.error("❌ Failed to create match");
      }
    } catch (error) {
      toast.error("⚠️ Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const deleteMatch = async (id) => {
    if (!confirm("Are you sure you want to delete this match?")) return;
    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("🗑️ Match deleted");
        fetchMatches();
      } else {
        toast.error("Failed to delete match");
      }
    } catch {
      toast.error("Error deleting match");
    }
  };

  const openEditModal = (match) => {
    setEditForm(match);
    setEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    if (e.target.name === "image") {
      setEditForm({ ...editForm, image: e.target.files[0] });
    } else {
      setEditForm({ ...editForm, [e.target.name]: e.target.value });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);

    const formData = new FormData();
    Object.keys(editForm).forEach((key) => {
      formData.append(key, editForm[key]);
    });

    try {
      const res = await fetch(`/api/events/${editForm._id}`, {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        toast.success("✏️ Match updated!");
        fetchMatches();
        setEditModalOpen(false);
      } else {
        toast.error("❌ Failed to update match");
      }
    } catch (error) {
      toast.error("⚠️ Update error");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="mt-[5rem] md:mt-2 md:w-full">
      <h3>Match Management</h3>
      {/* Create Match Form */}
      <div className="p-6 bg-white shadow-sm rounded-sm border mt-[4rem] mb-[6rem]">
        <h4 className="text-2xl font-bold mb-4">Create Match</h4>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 flex flex-col gap-y-2"
        >
          <input
            name="title"
            placeholder="Match Title (e.g., Team A vs Team B)"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            value={form.title}
          />
          <textarea
            name="description"
            placeholder="Match Details"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            value={form.description}
          />
          <input
            type="date"
            name="date"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            value={form.date}
          />
          <input
            type="time"
            name="time"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            value={form.time}
          />
          <input
            type="number"
            name="price"
            placeholder="Ticket Price"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            value={form.price}
          />
          <select
            name="status"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            value={form.status}
          >
            <option>Upcoming</option>
            <option>Completed</option>
          </select>
          <input
            type="file"
            name="image"
            className="w-full p-2 border rounded"
            onChange={handleChange}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-dark hover:bg-gray-700 text-white py-2 flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-2" /> Creating...
              </>
            ) : (
              "Create Match"
            )}
          </button>
        </form>
      </div>

      {/* Match Management */}
      <div>
        <h4 className="text-xl font-bold mb-4 mt-7">Manage Matches</h4>
        <hr />
        {fetching ? (
          <p>Loading matches...</p>
        ) : matches.length === 0 ? (
          <p className="text-gray-500">No matches found</p>
        ) : (
          <div className="space-y-4 flex flex-wrap">
            {matches.map((match) => (
              <div
                key={match._id}
                className="p-2 border rounded flex justify-between items-center flex-col"
              >
                <div>
                  {match.image ? (
                    <img
                      src={match.image}
                      alt={match.title || "Match Image"}
                      className="mb-4 h-auto w-auto object-cover"
                    />
                  ) : (
                    <div className="rounded-lg mb-2 w-full h-48 bg-green-600 flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <h6 className="font-extrabold">{match.title}</h6>
                    <div className="flex gap-3">
                      <button
                        onClick={() => deleteMatch(match._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                      <button
                        onClick={() => openEditModal(match)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Pencil size={18} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {match.date} • {match.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Match Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
            <button
              onClick={() => setEditModalOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4">Edit Match</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                name="title"
                placeholder="Match Title"
                className="w-full p-2 border rounded"
                onChange={handleEditChange}
                value={editForm.title || ""}
              />
              <textarea
                name="description"
                placeholder="Match Details"
                className="w-full p-2 border rounded"
                onChange={handleEditChange}
                value={editForm.description || ""}
              />
              <input
                type="date"
                name="date"
                className="w-full p-2 border rounded"
                onChange={handleEditChange}
                value={editForm.date?.split("T")[0] || ""}
              />
              <input
                type="time"
                name="time"
                className="w-full p-2 border rounded"
                onChange={handleEditChange}
                value={editForm.time || ""}
              />
              <input
                type="number"
                name="price"
                placeholder="Ticket Price"
                className="w-full p-2 border rounded"
                onChange={handleEditChange}
                value={editForm.price || ""}
              />
              <select
                name="status"
                className="w-full p-2 border rounded"
                onChange={handleEditChange}
                value={editForm.status || "Upcoming"}
              >
                <option>Upcoming</option>
                <option>Completed</option>
              </select>
              <input
                type="file"
                name="image"
                className="w-full p-2 border rounded"
                onChange={handleEditChange}
              />
              <button
                type="submit"
                disabled={updating}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded flex items-center justify-center"
              >
                {updating ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />{" "}
                    Updating...
                  </>
                ) : (
                  "Update Match"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
