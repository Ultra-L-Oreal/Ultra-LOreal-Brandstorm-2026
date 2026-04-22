//src/pages/order/OrderSample.tsx - guest quick flow
import { useNavigate } from 'react-router-dom';

export default function OrderSample(){
  const nav = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-900 py-20">
      <div className="container">
        <div className="max-w-3xl mx-auto bg-neutral-900/60 border border-neutral-800 p-8 rounded-xl">
          <h1 className="text-3xl font-serif text-white mb-4">Order a Demo Kit</h1>
          <p className="text-neutral-300 mb-6">Try 3 blind micro-vials at home. Choose guest checkout or sign up for full benefits.</p>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Quick guest order</h3>
              <p className="text-neutral-400 mb-4">No account required — phone verification only. Safety screening before dispatch.</p>
              <button onClick={() => nav('/auth/guest')} className="bg-ultraGold text-black px-6 py-3 rounded">Order as Guest</button>
            </div>

            <div>
              <h3 className="text-lg font-medium text-white mb-2">Personalized Scent Flight</h3>
              <p className="text-neutral-400 mb-4">Sign in to link your Safety Passport, outfit, and history for curated picks.</p>
              <button onClick={() => nav('/auth/login')} className="px-6 py-3 border border-neutral-700 text-neutral-200 rounded">Sign in</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/*Get a Sample (/order/sample): intended for quick demo kit with minimal friction.
 If user is authenticated, prefill phone and safety passport. If not, present the GuestCheckout or prompt to sign in/register. After ordering, route to /order/success.*/
