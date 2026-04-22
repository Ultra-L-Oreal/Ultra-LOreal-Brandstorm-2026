//Order Success Page
// src/pages/order/OrderSuccess.tsx
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const kitId = params.get("kit") || "ULTRA-KIT-001"; // fallback for demo
  const estimatedDays = 3;

  useEffect(() => {
    // Optional: analytics event
    console.log("Order success viewed", { kitId });
  }, [kitId]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center">
        
        {/* Success Icon */}
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-ultraGold/10 flex items-center justify-center border border-ultraGold/30">
            <span className="text-ultraGold text-3xl">✓</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-serif mb-4 text-ultraGold">
          Your Scent Flight is on its way
        </h1>

        {/* Subtitle */}
        <p className="text-neutral-300 mb-6 leading-relaxed">
          A curated set of micro-samples has been prepared for you.  
          Each vial is coded for a blind evaluation - your preferences will shape your future scent identity.
        </p>

        {/* Order Details */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 mb-8 text-left">
          <div className="flex justify-between mb-2">
            <span className="text-neutral-400">Kit ID</span>
            <span className="text-white font-medium">{kitId}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-neutral-400">Estimated Delivery</span>
            <span className="text-white">{estimatedDays}–5 days</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-400">Status</span>
            <span className="text-green-400">Processing</span>
          </div>
        </div>

        {/* What Next */}
        <div className="text-left mb-10">
          <h3 className="text-lg font-semibold text-white mb-3">
            What happens next
          </h3>

          <ul className="space-y-3 text-neutral-300 text-sm">
            <li>• Your kit will be shipped or prepared for pickup</li>
            <li>• Each vial will be labeled A, B, and C for blind testing</li>
            <li>• Scan the QR code in your kit to start voting</li>
            <li>• Your feedback will refine your scent profile</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 bg-ultraGold text-black rounded-md font-semibold hover:scale-[1.02] transition-transform"
          >
            Go to Dashboard
          </button>

          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 border border-neutral-700 text-white rounded-md hover:border-ultraGold hover:text-ultraGold transition"
          >
            Back to Home
          </button>

          <button
            onClick={() => navigate("/vote/demo")}
            className="px-6 py-3 border border-ultraGold text-ultraGold rounded-md hover:bg-ultraGold hover:text-black transition"
          >
            Try Demo Vote
          </button>
        </div>

        {/* Luxury Footer Note */}
        <p className="mt-10 text-xs text-neutral-500">
          Ultra uses blind micro-sample evaluation and safety-aware filtering  
          to craft fragrances aligned with your identity.
        </p>
      </div>
    </div>
  );
}
