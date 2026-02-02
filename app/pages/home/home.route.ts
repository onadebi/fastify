import { FastifyInstance } from "fastify";
import { RenderWithLayout } from "../../utils/RenderWithLayout";

export default async function homeRoute(app: FastifyInstance) {
    app.get("/", async (_req, reply) => {
        return RenderWithLayout("index.ejs", {
            title: "Welcome to OnaxERP",
            description: "OnaxERP - Open Source ERP Solution"
        }, reply);
    });

    app.get("contact", async (_req, reply) => {
        return RenderWithLayout("contact.ejs", {
            title: "Contact Us - OnaxERP",
            description: "Get in touch with the OnaxERP team."
        }, reply);
    });

    app.get("about", async (_req, reply) => {
        return RenderWithLayout("about.ejs", {
            title: "About Us - OnaxERP",
        }, reply);
    });
}