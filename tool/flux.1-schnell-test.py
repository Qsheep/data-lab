import torch
from diffusers import FluxPipeline

model_id = "black-forest-labs/FLUX.1-schnell"

pipe = FluxPipeline.from_pretrained(
    model_id,
    torch_dtype=torch.bfloat16,
    local_files_only=True,
)

# Important:
# Do NOT use pipe.to("mps") on your 24 GB Mac.
# Offloading keeps most model components in CPU memory
# and moves them when needed.
pipe.enable_model_cpu_offload()

prompt = """
cute children's flashcard illustration of a duck,
one duck only,
soft pastel colors,
clean simple cartoon style,
rounded friendly shapes,
plain white background,
no text
"""

image = pipe(
    prompt=prompt,
    guidance_scale=0.0,
    num_inference_steps=4,
    max_sequence_length=256,
    width=512,
    height=512,
    generator=torch.Generator("cpu").manual_seed(42),
).images[0]

image.save("flux_duck.png")
image.show()