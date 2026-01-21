export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    try {
      const notification = req.body;
      
      console.log('📩 Notificação recebida da Pagsmile:', JSON.stringify(notification, null, 2));
  
      const {
        trade_no,
        out_trade_no,
        trade_status,
        order_amount,
        app_id,
        buyer_id
      } = notification;
  
      if (trade_status === 'TRADE_SUCCESS') {
        console.log(`✅ Pagamento aprovado! Pedido: ${out_trade_no}`);
        // TODO: Atualizar banco de dados
        // TODO: Enviar email de confirmação
        // TODO: Liberar produto/serviço
      } else if (trade_status === 'TRADE_PENDING') {
        console.log(`⏳ Pagamento pendente. Pedido: ${out_trade_no}`);
      } else if (trade_status === 'TRADE_REFUSE') {
        console.log(`❌ Pagamento recusado. Pedido: ${out_trade_no}`);
      }
  
      return res.status(200).json({ return_code: 'success' });
      
    } catch (error) {
      console.error('❌ Erro ao processar webhook:', error);
      return res.status(500).json({ error: 'Erro ao processar notificação' });
    }
  }