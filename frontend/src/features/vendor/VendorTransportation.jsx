import { useState, useEffect } from 'react';
import { getMyPurchases } from '../../api/transactionApi';
import { useToast } from '../../context/ToastContext';
import { extractErrorMessage } from '../../utils/errorHandler';
import Spinner from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';

// Ecommerce-style shipment steps derived from the underlying transaction status.
const STEPS = [
  { key: 'PENDING', label: 'Order Placed' },
  { key: 'ACCEPTED', label: 'Picked Up / In Transit' },
  { key: 'COMPLETED', label: 'Delivered' },
];

function stepIndexForStatus(status) {
  if (status === 'REJECTED') return -1;
  const idx = STEPS.findIndex((s) => s.key === status);
  return idx === -1 ? 0 : idx;
}

function ShipmentTracker({ status }) {
  if (status === 'REJECTED') {
    return (
      <div className="mt-3 text-sm font-semibold text-red-600">
        ✕ Shipment cancelled — order was rejected by the farmer
      </div>
    );
  }

  const activeIdx = stepIndexForStatus(status);

  return (
    <div className="mt-4 flex items-center">
      {STEPS.map((step, idx) => (
        <div key={step.key} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                idx <= activeIdx ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {idx < activeIdx ? '✓' : idx + 1}
            </div>
            <span className="text-[11px] mt-1 text-center w-20 text-gray-600">{step.label}</span>
          </div>
          {idx < STEPS.length - 1 && (
            <div className={`flex-1 h-1 mx-1 rounded ${idx < activeIdx ? 'bg-green-700' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function VendorTransportation() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    getMyPurchases()
      .then((res) => setShipments(res.data))
      .catch((err) => showToast(extractErrorMessage(err, 'Failed to load transportation details'), 'error'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <h2 className="text-xl font-bold mb-1">Transportation</h2>
      <p className="text-sm text-gray-500 mb-4">
        Track pickup and delivery locations for every crop shipment on its way to you.
      </p>

      {shipments.length === 0 ? (
        <EmptyState message="No shipments yet. Buy crops from the Browse tab to see them here." icon="🚚" />
      ) : (
        <div className="space-y-4">
          {shipments.map((s) => (
            <div key={s.id} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <p className="font-semibold">{s.cropName}</p>
                  <p className="text-sm text-gray-600">{s.quantity} units — ₹{s.totalPrice}</p>
                </div>
                <p className="text-xs text-gray-400">{new Date(s.createdAt).toLocaleDateString()}</p>
              </div>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex gap-2">
                  <span className="text-green-700">📍</span>
                  <div>
                    <p className="text-xs text-gray-500">From (Farmer — {s.farmerName})</p>
                    <p className="font-medium">{s.pickupLocation}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="text-red-600">🏁</span>
                  <div>
                    <p className="text-xs text-gray-500">To (Delivery Location)</p>
                    <p className="font-medium">{s.dropLocation}</p>
                  </div>
                </div>
              </div>

              <ShipmentTracker status={s.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default VendorTransportation;
