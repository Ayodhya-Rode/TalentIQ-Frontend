import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getApprovedOrganizations,
  getAvailableSlots,
  createBooking,
  createPaymentOrder,
  verifyPayment,
} from "../../services/bookingService";
import { ArrowLeft, Building2 } from "lucide-react";

const DOMAINS = [
  "FULL_STACK",
  "DATA_SCIENCE",
  "DEVOPS",
  "JAVA_DEVELOPER",
  "AI_ENGINEER",
  "FRONTEND",
  "BACKEND",
];

function BookInterview() {
  const navigate = useNavigate();
  const [orgs, setOrgs] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState("");
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    getApprovedOrganizations()
      .then((res) => setOrgs(res.data.data))
      .catch(() => setError("Failed to load companies"));
  }, []);

  useEffect(() => {
    if (!selectedOrg || !selectedDomain) return;
    setLoadingSlots(true);
    getAvailableSlots(selectedOrg.id, selectedDomain)
      .then((res) => setSlots(res.data.data))
      .catch(() => setError("Failed to load slots"))
      .finally(() => setLoadingSlots(false));
  }, [selectedOrg, selectedDomain]);

  const handleBook = async (dateStr) => {
    setBooking(true);
    setError("");
    try {
      const res = await createBooking({
        organizationId: selectedOrg.id,
        domain: selectedDomain,
        scheduledDate: dateStr,
      });
      const bookingId = res.data.data.id;

      const orderRes = await createPaymentOrder(bookingId);
      const { orderId, amount, keyId } = orderRes.data.data;

      const rzp = new window.Razorpay({
        key: keyId,
        amount,
        currency: "INR",
        order_id: orderId,
        name: "TalentIQ Mock Interview",
        handler: async (response) => {
          await verifyPayment({
            bookingId,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          navigate("/candidate/my-bookings");
        },
        modal: {
          ondismiss: () => setBooking(false),
        },
      });
      rzp.open();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to book");
      setBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center gap-2 text-sm text-text-muted hover:text-text"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <h1 className="font-display text-2xl font-semibold mb-6">
          Book a mock interview
        </h1>
        {error && <p className="text-danger text-sm mb-4">{error}</p>}

        <div className="mb-6">
          <h2 className="text-sm font-semibold mb-2">1. Choose a company</h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {orgs.map((org) => (
              <button
                key={org.id}
                onClick={() => {
                  setSelectedOrg(org);
                  setSelectedDomain(null);
                  setSlots([]);
                }}
                className={`flex items-center gap-2 p-3 rounded-lg border text-left transition-colors ${
                  selectedOrg?.id === org.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-surface"
                }`}
              >
                <Building2 size={16} className="text-primary flex-shrink-0" />
                <span className="text-sm font-medium">{org.name}</span>
              </button>
            ))}
          </div>
        </div>

        {selectedOrg && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold mb-2">2. Choose a domain</h2>
            <div className="flex flex-wrap gap-2">
              {DOMAINS.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDomain(d)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                    selectedDomain === d
                      ? "bg-primary text-white border-primary"
                      : "border-border text-text-muted hover:bg-bg"
                  }`}
                >
                  {d.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedDomain && (
          <div>
            <h2 className="text-sm font-semibold mb-2">3. Choose a time</h2>
            {loadingSlots && (
              <p className="text-text-muted text-sm">Loading slots...</p>
            )}
            {!loadingSlots && slots.length === 0 && (
              <p className="text-text-muted text-sm">
                No slots available in the next 14 days.
              </p>
            )}
            <div className="grid sm:grid-cols-2 gap-2">
              {slots.map((s) => (
                <button
                  key={s}
                  onClick={() => handleBook(s)}
                  disabled={booking}
                  className="p-3 rounded-lg border border-border hover:bg-primary/5 hover:border-primary text-sm text-left transition-colors disabled:opacity-50"
                >
                  {new Date(s).toLocaleString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookInterview;
