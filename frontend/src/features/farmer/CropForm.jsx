import { useState, useEffect } from 'react';

function CropForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    cropName: '',
    quantity: '',
    unit: '',
    pricePerUnit: '',
    description: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        cropName: initialData.cropName || '',
        quantity: initialData.quantity || '',
        unit: initialData.unit || '',
        pricePerUnit: initialData.pricePerUnit || '',
        description: initialData.description || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      ...formData,
      quantity: parseFloat(formData.quantity),
      pricePerUnit: parseFloat(formData.pricePerUnit),
    });
  };

  const totalValue =
    (Number(formData.quantity) || 0) *
    (Number(formData.pricePerUnit) || 0);

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-lg mb-6"
    >
      <h2 className="text-2xl font-bold text-green-700 mb-6">
        {initialData ? 'Edit Crop' : 'Add New Crop'}
      </h2>

      <div className="grid md:grid-cols-2 gap-4">

        {/* Crop Name */}
        <div>
          <label className="block mb-1 font-medium">
            Crop Name
          </label>
          <input
            type="text"
            name="cropName"
            placeholder="Enter crop name"
            value={formData.cropName}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            required
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="block mb-1 font-medium">
            Available Quantity
          </label>
          <input
            type="number"
            name="quantity"
            min="0"
            step="0.01"
            placeholder="Enter quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            required
          />
        </div>

        {/* Unit */}
        <div>
          <label className="block mb-1 font-medium">
            Unit
          </label>
          <select
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            required
          >
            <option value="">Select Unit</option>
            <option value="kg">Kilogram (kg)</option>
            <option value="quintal">Quintal</option>
            <option value="ton">Tonne</option>
          </select>
        </div>

        {/* Price */}
        <div>
          <label className="block mb-1 font-medium">
            Price per Unit (₹)
          </label>
          <input
            type="number"
            name="pricePerUnit"
            min="0"
            step="0.01"
            placeholder="Enter price"
            value={formData.pricePerUnit}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            required
          />
        </div>
      </div>

      {/* Description */}
      <div className="mt-4">
        <label className="block mb-1 font-medium">
          Description
        </label>
        <textarea
          name="description"
          rows="3"
          placeholder="Write crop details..."
          value={formData.description}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        />
      </div>

      {/* Live Preview */}
      <div className="mt-6 bg-green-50 border border-green-300 rounded-lg p-5">
        <h3 className="text-lg font-bold text-green-700 mb-3">
          📦 Crop Listing Preview
        </h3>

        <div className="space-y-2 text-gray-700">
          <p>
            🌾 <strong>Crop:</strong>{' '}
            {formData.cropName || 'Not entered'}
          </p>

          <p>
            📦 <strong>Available:</strong>{' '}
            {formData.quantity || 0}{' '}
            {formData.unit || ''}
          </p>

          <p>
            💰 <strong>Price:</strong>{' '}
            ₹{formData.pricePerUnit || 0}
            {formData.unit && ` per ${formData.unit}`}
          </p>

          <p>
            💵 <strong>Total Stock Value:</strong>{' '}
            <span className="font-bold text-green-700">
              ₹{totalValue.toLocaleString()}
            </span>
          </p>

          {formData.description && (
            <p>
              📝 <strong>Description:</strong>{' '}
              {formData.description}
            </p>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-6">
        <button
          type="submit"
          className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-lg"
        >
          {initialData ? 'Update Crop' : 'Add Crop'}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default CropForm;