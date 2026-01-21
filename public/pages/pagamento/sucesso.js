import { useRouter } from 'next/router';
import { CheckCircle } from 'lucide-react';

export default function PagamentoSucesso() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-green-500 p-4 rounded-full">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Pagamento Processado!
        </h1>
        
        <p className="text-gray-600 mb-8">
          Seu pagamento está sendo processado. Você receberá uma confirmação por email em breve.
        </p>
        
        <button
          onClick={() => router.push('/')}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition"
        >
          Voltar ao Início
        </button>
      </div>
    </div>
  );
}