import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ success: false, error: 'Image is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Parsing receipt with AI...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are a receipt parser AI. Extract transaction information from receipt images.
            
Return a JSON object with the following structure:
{
  "transactions": [
    {
      "title": "Item name or description",
      "amount": 0.00,
      "category": "food|transport|entertainment|bills|shopping|health|education|other",
      "type": "expense"
    }
  ],
  "total": 0.00,
  "store_name": "Store name if visible",
  "date": "YYYY-MM-DD format if visible, otherwise null"
}

Categories to use:
- food: Food, beverages, restaurants, groceries
- transport: Transportation, fuel, parking
- entertainment: Movies, games, hobbies
- bills: Utilities, subscriptions
- shopping: Clothing, electronics, general shopping
- health: Medicine, healthcare
- education: Books, courses
- other: Anything else

Extract all line items as separate transactions. Use the local currency shown on the receipt.
If you cannot parse the receipt, return { "error": "Cannot parse receipt" }`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Please parse this receipt and extract all transaction items with their amounts and categories.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64.startsWith('data:') ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'parse_receipt',
              description: 'Parse receipt and extract transaction data',
              parameters: {
                type: 'object',
                properties: {
                  transactions: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        title: { type: 'string' },
                        amount: { type: 'number' },
                        category: { 
                          type: 'string', 
                          enum: ['food', 'transport', 'entertainment', 'bills', 'shopping', 'health', 'education', 'other'] 
                        },
                        type: { type: 'string', enum: ['expense', 'income'] }
                      },
                      required: ['title', 'amount', 'category', 'type']
                    }
                  },
                  total: { type: 'number' },
                  store_name: { type: 'string' },
                  date: { type: 'string' }
                },
                required: ['transactions']
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'parse_receipt' } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ success: false, error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ success: false, error: 'AI credits exhausted. Please add credits.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to parse receipt' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('AI response received');

    // Extract the tool call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      const parsedData = JSON.parse(toolCall.function.arguments);
      return new Response(
        JSON.stringify({ success: true, data: parsedData }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fallback: try to parse from content
    const content = data.choices?.[0]?.message?.content;
    if (content) {
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsedData = JSON.parse(jsonMatch[0]);
          return new Response(
            JSON.stringify({ success: true, data: parsedData }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      } catch (e) {
        console.error('Failed to parse content as JSON:', e);
      }
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Could not extract receipt data' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Receipt parsing error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});