import React, { useState } from 'react';
import { updateManufacturingStatus } from '../services/storage';
import { X, Save } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ManufacturingModal({ invoice, onClose, onSaveSuccess }) {
  const { tr } = useLanguage();
  const [orderStatus, setOrderStatus] = useState(invoice.order_status || 'PENDING');
  const [pengeluaran, setPengeluaran] = useState(invoice.pengeluaran || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const success = await updateManufacturingStatus(invoice.id, orderStatus, pengeluaran);
      if (success) {
        onSaveSuccess();
      } else {
        alert('Gagal mengemas kini data pengeluaran.');
      }
    } catch (err) {
      console.error(err);
      alert('Ralat semasa mengemas kini pengeluaran.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h3>KEMAS KINI PENGELUARAN</h3>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ marginBottom: '1rem' }}>
              <strong>No. Invoice:</strong> {invoice.invoice_no} <br/>
              <strong>Pelanggan:</strong> {invoice.client_name}
            </div>

            <div className="form-group">
              <label className="form-label">Status Operasi</label>
              <select 
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value)}
                className="form-control"
              >
                <option value="PENDING">Pending</option>
                <option value="PROCESSING">Processing</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: 'var(--primary-red)' }}>Kos Kilang (RM)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={pengeluaran}
                onChange={(e) => setPengeluaran(e.target.value)}
                placeholder="0.00"
                className="form-control"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              {tr('cancel')}
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={16} /> {loading ? 'Menyimpan...' : tr('saveChanges')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
