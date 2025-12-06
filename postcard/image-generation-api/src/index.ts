import { Hono } from "hono";
import { Buffer } from "node:buffer";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.get("/message", (c) => {
  return c.text("Hello Hono!");
});


app.post("/api/image/prompt", async (c) => {
  try {
    const body = await c.req.json();
    const { city } = body;

    if (!city) {
      return c.json({ error: "Missing 'city' parameter" }, 400);
    }

    let imagePrompt: string = "";
    
    // Use the text generation model with proper parameters
    const response = await c.env.AI.run("@cf/meta/llama-2-7b-chat-int8", {
      prompt: `You are an expert prompt engineer. Generate a detailed image prompt for a high-quality postcard-style image of ${city}. The prompt should be vivid, artistic, and suitable for image generation. Only return the prompt, nothing else.`,
      max_tokens: 256,
    }) as any;

    // Extract the response text
    if (typeof response === "string") {
      imagePrompt = response;
    } else if (response && response.result && response.result.response) {
      imagePrompt = response.result.response;
    } else if (response && response.response) {
      imagePrompt = response.response;
    } else {
      console.log("Unexpected response format:", response);
      imagePrompt = String(response);
    }

    return c.json({ city, imagePrompt: imagePrompt.trim() });
  } catch (error) {
    console.error("Error in /api/image/prompt:", error);
    return c.json({ error: "Failed to generate prompt", details: String(error) }, 500);
  }
});

app.post("/api/image/generation", async (c) => {
  try {
    const body = await c.req.json();
    const { imagePrompt, city, name } = body;

    if (!imagePrompt || !city || !name) {
      return c.json({ error: "Missing required parameters: imagePrompt, city, name" }, 400);
    }

    // Call the image generation model
    const generateImage = await c.env.AI.run("@cf/black-forest-labs/flux-1-schnell", {
      prompt: imagePrompt,
    }) as any;

    if (!generateImage || !generateImage.image) {
      return c.json({ error: "Failed to generate image", details: String(generateImage) }, 500);
    }

    // The image is returned as a base64-encoded string
    const base64Image = generateImage.image;

    const buffer = Buffer.from(base64Image, "base64");

    // Create key for the image file
    const key = `postcards-${city}-${name}-${Date.now()}.png`;

    // Upload the image to R2 (commented out for now)
    await c.env.BUCKET.put(key, buffer, {
      httpMetadata: {
        contentType: "image/png",
      },
    });
    
    return c.json({ message: "Image generated successfully", key });
  } catch (error) {
    console.error("Error in /api/image/generation:", error);
    return c.json({ error: "Failed to generate image", details: String(error) }, 500);
  }
});


app.get("/api/images/:key", async (c) => {
  try {
    const { key } = c.req.param();
    const object = await c.env.BUCKET.get(key);
    if (!object) {
      return c.json({ message: "Image not found" }, 404);
    }
    const arrayBuffer = await object.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return c.body(buffer, 200, {
      "Content-Type": "image/png",
    });
  } catch (error) {
    console.error("Error in /api/images/:key:", error);
    return c.json({ error: "Failed to retrieve image", details: String(error) }, 500);
  }
});

app.onError((err, c) => {
  console.error("Hono error:", err);
  return c.json({ error: "Internal server error", details: String(err) }, 500);
});

export default app;
