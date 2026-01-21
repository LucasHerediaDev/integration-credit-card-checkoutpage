export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    try {
      const { name, email, cpf, amount, description } = req.body;
  
      if (!name || !email || !cpf || !amount) {
        return res.status(400).json({ error: 'Campos obrigatórios faltando' });
      }
  
      const appId = process.env.PAGSMILE_APP_ID;
      const securityKey = process.env.PAGSMILE_SECURITY_KEY;
      const apiUrl = process.env.PAGSMILE_API_URL || 'https://gateway-test.pagsmile.com';
  
      if (!appId || !securityKey) {
        return res.status(500).json({ error: 'Configuração do servidor incompleta' });
      }
  
      const outTradeNo = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const now = new Date();
      const timestamp = now.toISOString().slice(0, 19).replace('T', ' ');
  
      const payload = {
        app_id: appId,
        out_trade_no: outTradeNo,
        order_currency: 'BRL',
        order_amount: amount.toFixed(2).toString(),
        subject: description || 'Pagamento com Cartão',
        content: description || 'Pagamento processado via Pagsmile',
        trade_type: 'WEB',
        timestamp: timestamp,
        notify_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/pagsmile/webhook`,
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pagamento/sucesso`,
        buyer_id: `customer-${Date.now()}`,
        customer: {
          name: name,
          email: email,
          identify: {
            type: 'CPF',
            number: cpf
          }
        },
        regions: ['BRA'],
        timeout_express: '1d'
      };
  
      const authToken = Buffer.from(`${appId}:${securityKey}`).toString('base64');
  
      console.log('Enviando requisição para Pagsmile:', {
        url: `${apiUrl}/trade/create`,
        out_trade_no: outTradeNo
      });
  
      const response = await fetch(`${apiUrl}/trade/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${authToken}`
        },
        body: JSON.stringify(payload)
      });
  
      const data = await response.json();
  
      console.log('Resposta da Pagsmile:', data);
  
      if (data.code === '10000') {
        return res.status(200).json({
          code: data.code,
          msg: data.msg,
          web_url: data.web_url,
          trade_no: data.trade_no,
          out_trade_no: data.out_trade_no,
          prepay_id: data.prepay_id
        });
      } else {
        return res.status(400).json({
          error: data.msg || 'Erro ao criar pagamento',
          sub_code: data.sub_code,
          sub_msg: data.sub_msg
        });
      }
  
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      return res.status(500).json({ 
        error: 'Erro interno do servidor',
        message: error.message 
      });
    }
  }