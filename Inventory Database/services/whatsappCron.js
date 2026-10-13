 const cron=require('node-cron')
 const twilio=require('twilio')
const mainInventory=require('../models/Inventory')

const client=twilio(process.env.TWILIO_ACCOUNT_SID,process.env.TWILIO_AUTH_TOKEN)

cron.schedule('* * * * *',async()=>{
    try{
        console.log("Cron job shuru  hora hai")
        const allItems=await mainInventory.find()
        const aajkiTarikh= new Date()

        const expiringItems=allItems.filter((item)=>{
            const expiry=new Date(item.expiryDate)
            const timeDifference=expiry-aajkiTarikh
            const daysLeft=Math.ceil(timeDifference/(1000*60*60*24))
            return daysLeft<=3 && daysLeft>0

        })
        if (expiringItems.length>0){
            let messageBody=`🚨 *Smart Inventory Alert* 🚨\n\nBhai, ye saman 3 din mein expire hone wala hai:\n\n`;
            
            expiringItems.forEach(item => {
                messageBody += `📦 ${item.productName} (Batch: ${item.batchNumber})\n`;
            });
            
            messageBody += `\nJaldi stock clear kar!`;
            const message = await client.messages.create({
                contentSid:"HXfe5ab5f00277942d4d4200328b4d403c",
                contentVariables:JSON.stringify({
                    '1':'Lala Ji',
                    '2':'Smart Inventory'
                }),
                
                from: process.env.TWILIO_WHATSAPP_NUMBER,
                to: process.env.MY_WHATSAPP_NUMBER
            });

            console.log(`WhatsApp Alert Sent! Message SID: ${message.sid}`);
        } else {
            console.log("Sab badhiya hai. Koi item expire nahi ho raha.");
        }
    } catch (error) {
        console.error("Cron Job mein error aagya bhai:", error);
    }
});
        