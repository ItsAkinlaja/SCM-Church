import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (_req: Request) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const today = new Date()
    const monthDay = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

    // 1. Fetch members with birthdays today
    const { data: members, error: memberError } = await supabase
      .from('members')
      .select('*')

    if (memberError) throw memberError

    const celebrants = members.filter((m: any) => m.birthday?.endsWith(monthDay))

    if (celebrants.length === 0) {
      return new Response(JSON.stringify({ message: "No birthdays today" }), { status: 200 })
    }

    // 2. Send Emails via Resend
    const emailPromises = celebrants.map(async (member: any) => {
      if (!member.email) return null

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'SCM International <office@scmchurch.org>',
          to: [member.email],
          subject: `Happy Birthday, ${member.name}! 🎂 | SCM International`,
          headers: {
            'X-Entity-Ref-ID': `${member.id}-${today.getFullYear()}`,
            'List-Unsubscribe': '<mailto:office@scmchurch.org?subject=unsubscribe>',
          },
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: 'DM Sans', sans-serif; background-color: #f6f1e7; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 40px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.05); border: 1px solid #eadfca; }
                .header { background: #071126; padding: 60px 40px; text-align: center; position: relative; }
                .logo { height: 80px; margin-bottom: 20px; }
                .content { padding: 50px 40px; text-align: center; line-height: 1.8; color: #334155; }
                .greeting { font-size: 28px; font-weight: 800; color: #071126; margin-bottom: 20px; }
                .prayer-box { background: #fff1ee; border-radius: 30px; padding: 40px; margin: 40px 0; border: 1px dashed #b53a2d; }
                .prayer-title { font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.2em; color: #b53a2d; margin-bottom: 15px; display: block; }
                .prayer-text { font-style: italic; font-size: 18px; color: #475569; font-weight: 500; }
                .scripture { font-size: 12px; font-weight: 700; color: #b53a2d; margin-top: 15px; display: block; }
                .footer { background: #fbf7eb; padding: 40px; text-align: center; border-top: 1px solid #eadfca; }
                .closing { font-weight: 700; color: #071126; }
                .unsub { font-size: 10px; color: #94a3b8; margin-top: 20px; text-decoration: none; text-transform: uppercase; letter-spacing: 0.1em; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <img src="https://ik.imagekit.io/scmchurch/WhatsApp_Image_2026-03-27_at_05.29.17-removebg-preview.png?updatedAt=1774595668191" class="logo" alt="SCM Logo">
                </div>
                <div class="content">
                  <div class="greeting">Happy Birthday, ${member.name}!</div>
                  <p>On this glorious day of your birth, the entire SCM International family joins the host of heaven to celebrate the gift of your life. You are a valued pillar in God's house, and we are blessed to have you with us.</p>
                  
                  <div class="prayer-box">
                    <span class="prayer-title">A Special Prayer for You</span>
                    <div class="prayer-text">
                      "We pray that the Almighty God, who has brought you to this new year, will satisfy you with long life and show you His salvation. May His grace be your shield, His wisdom your guide, and His love your constant companion. In this new season, may every door you knock on be opened, and may your testimony be ever-increasing."
                    </div>
                    <span class="scripture">Numbers 6:24-26</span>
                  </div>

                  <p>Enjoy your day in the presence of the King!</p>
                  <p class="closing">With Love,<br>The SCM International Team</p>
                </div>
                <div class="footer">
                  <p style="font-size: 12px; color: #64748b; margin: 0;">Successful Christian Missions International</p>
                  <p style="font-size: 10px; color: #94a3b8; margin-top: 5px;">Founded July 18, 1999 • Worship, Word, and Prayer</p>
                  <a href="#" class="unsub">Manage Preferences</a>
                </div>
              </div>
            </body>
            </html>
          `,
        }),
      })
      return res.json()
    })

    const results = await Promise.all(emailPromises)

    return new Response(JSON.stringify({ message: `Sent ${celebrants.length} shoutouts`, results }), { 
      status: 200,
      headers: { "Content-Type": "application/json" }
    })

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})
