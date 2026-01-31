import { nanoid } from "nanoid";
import "dotenv/config";
import { prisma } from "./lib/prisma";

const targetUrl = process.argv[2];

if (!targetUrl) {
    console.error("❌ กรุณาใส่ URL ที่ต้องการย่อด้วยครับ");
    console.error("👉 ตัวอย่าง: npm run add https://google.com");
    process.exit(1);
}

async function main() {
    console.log("⏳ กำลังสร้างลิงก์...");

    const token = nanoid(10);
    
    await prisma.oneTimeLink.create({
        data: {
            token: token,
            targetUrl: targetUrl,
        },
    });

    const port = process.env.PORT || 4000;
    const baseUrl = process.env.BASE_URL || `http://localhost:${port}`;
    const shortLink = `${baseUrl}/go/${token}`;

    console.log("\n✅ สร้างสำเร็จ! (พร้อมใช้งาน)");
    console.log("------------------------------------------------");
    console.log(`🔗 Link:  ${shortLink}`);
    console.log(`🎯 Target: ${targetUrl}`);
    console.log("------------------------------------------------\n");
}

main()
    .catch((e) => {
        console.error("❌ Error:", e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });