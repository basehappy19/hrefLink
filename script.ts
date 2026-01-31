import express from "express";
import { nanoid } from "nanoid";
import cors from "cors";
import "dotenv/config";
import { prisma } from "./lib/prisma";
import path from "path";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());


app.get("/go/:token", async (req, res) => {
    const { token } = req.params;

    try {
        const link = await prisma.oneTimeLink.findUnique({
            where: { token: token },
        });

        if (!link || link.isUsed) {
            const filePath = path.join(process.cwd(), 'public', 'expired.html');
            
            return res.status(410).sendFile(filePath);
        }

        await prisma.oneTimeLink.update({
            where: { id: link.id },
            data: { isUsed: true },
        });

        return res.redirect(link.targetUrl);
    } catch (error) {
        console.error("Redirect Error:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
