import { FastifyReply } from "fastify";

export interface RenderData {
    title?: string;
    description?: string;
    [key: string]: any;
}

function RenderWithLayout(page: string, data: RenderData, reply: FastifyReply, layout = "main") {
    const finalData: RenderData ={
        ...data,
        title: data.title || "OnaxERP - Open Source ERP Solution",
        description: data.description || "OnaxERP is a comprehensive open-source ERP solution designed to streamline business processes and enhance productivity."
    }
    return reply.view(`layouts/${layout}`, {
        ...finalData,
        body: page
    });
}

export {
    RenderWithLayout
}