---
id: developer-guide
title: Developer's Guide
sidebar_position: 6
---

This guide will help you get started with developing, testing, deploying, and running Cube AI.

## Cloning the Repository

Clone Cube AI repository by running:

```bash
git clone https://github.com/ultravioletrs/cube.git
cd cube
```

## Building and Running

### Building Docker Images

You can build the Docker images for Cube AI and related services using the `make` command in the project's root directory.

To build the production Docker image, use:

```bash
make docker
```

For the development Docker image, use:

```bash
make docker-dev
```

### Running Services

To start the Cube AI services, simply run:

```bash
make up
```

This command will start the services using the default configuration (Ollama backend).

### Configuration

You can configure the services using environment variables or by modifying the `docker/.env` file.

To use the vLLM backend:

```bash
make up-vllm
```

To use the Ollama backend (default):

```bash
make up-ollama
```

For custom port configurations, update the `docker/.env` file:

```bash
UI_PORT=8080
UV_CUBE_NEXTAUTH_URL=http://<your-ip>:${UI_PORT}
```

Then restart the services:

```bash
make restart
```

For a full list of available commands, run:

```bash
make help
```

After successfully deploying Cube AI, you can perform various tasks to set up and manage your instance. These include:

- Managing domains
- Managing users
- Generating authentication tokens (using curl command)
- Intergrating your `Cube AI` instance with `Continue` Visual Studio Code extension to leverage large language models (LLMs) directly within VS Code to assist with coding task

For detailed instructions on the above tasks and more, refer to the [Getting Started Guide](https://github.com/ultravioletrs/cube-docs/blob/main/docs/getting-started.md).

## Open Web UI Integration

Open Web UI is integrated into Cube AI to help in debugging and monitoring key performance metrics of the LLMs, including response token/s, prompt token/s, total duration, and load duration. For more detailed setup and configuration instructions, refer to the [Open Web UI documentation](https://docs.openwebui.com/).

To access Open Web UI, once Cube AI services are up and running, open your browser and navigate to:

```bash
http://<your-server-ip-address>:3000
```

While it should work out of the box, occasionally, when you submit a prompt through the Open Web UI, you might encounter an error like this:

```bash
Ollama: 400, message='Bad Request', url='http://ollama:11434/api/chat'
```

To resolve the error:

- Click on your **profile icon** in the top-right corner of the Open Web UI interface.
- Navigate to **Settings**.
- Select **Admin Settings**.
- In the **Admin Panel**, select **Connections** from the sidebar.
- Under the **Ollama API** section, click the **refresh** icon next to the Ollama API URL (`http://ollama:11434`).
- After refreshing, you should see a confirmation message stating **"Server connection verified"**. This should reset the connection to the Ollama service and resolve the "Bad Request" error.

## Hardware Abstraction Layer (HAL) for Confidential Computing

For detailed instructions on setting up and building Cube HAL, please refer to [this guide](https://github.com/ultravioletrs/cube/blob/main/hal/buildroot/README.md). It covers:

- Cloning the Buildroot and Cube repositories
- Configuring and building Cube HAL
- Running Cube HAL in a virtual machine

## Private Model Upload

1. **Package the Model Files**

   First, compress your model files into a `.tar.gz` archive to prepare them for transfer:

   ```bash
   tar -czvf model-name.tar.gz /path/to/model/files
   ```

2. **Set Up Cube HAL**

   Follow the Hardware Abstraction Layer (HAL) for Confidential Computing setup to:

   - Install Buildroot
   - Clone the Cube AI repository
   - Pull and start Cube AI docker containers

3. **Enable SSH and Access the CVM**

   SSH is needed to securely connect and transfer files to the CVM. Follow the steps in the [SSH guide](https://github.com/ultravioletrs/cube/blob/main/hal/buildroot/ssh.md) to enable SSH access on the CVM.

4. **Transfer the Model Archive to the CVM**

   Once SSH is set up, use `scp` to securely copy the `.tar.gz` file from step 1 to the CVM. For detailed steps, refer to the [SSH guide](https://github.com/ultravioletrs/cube/blob/main/hal/buildroot/ssh.md).

5. **Decompress and Extract the Model Files on the CVM**  
   After transferring the archive to the CVM, log in to the CVM and use `gunzip` to decompress the `.tar.gz` file, then extract the `.tar` file:

   ```bash
   gunzip model-name.tar.gz
   tar -xvf model-name.tar
   ```

6. **Copy the Extracted Model Files to the `ollama` Container**

   With the model files unpacked, copy them to the `ollama` container running on the CVM:

   ```bash
   docker cp /path/to/extracted/files ollama:/path/to/target/directory/in/container
   ```

   Replace `/path/to/extracted/files` with the path of the unpacked files on the CVM and `/path/to/target/directory/in/container` with the destination directory inside the `ollama` container.

## Fine-Tuning Base Model on Custom Code Dataset

To enhance the performance of the base model on domain-specific tasks or particular code styles, you may want to fine-tune it on a custom code dataset. This process will help adapt the model to your specific requirements.

### Prerequisites

1. **Python Environment**: Ensure you have Python 3.8 or above.

2. **Dependencies**:

   - `transformers`: for model handling. For more information, see the [transformers Documentation](https://huggingface.co/docs/transformers/index).
   - `datasets`: for data handling. For more information, see the [datasets library](https://huggingface.co/docs/datasets/index).
   - `torch`: for model training. Alternative is `TensorFlow` with `Keras`. For more information, see the [TensorFlow Documentation](https://www.tensorflow.org/).
   - `peft`: for parameter-efficient fine-tuning (PEFT) if needed. For more information, see the [PEFT Documentation](https://huggingface.co/docs/peft/index).
   - `unsloth`: for advanced model handling and integration of LoRA adapters and other fine-tuning techniques. For more information, see the [unsloth GitHub Repository](https://github.com/unslothai/unsloth).
   - **Optional Libraries**: Install additional packages for LoRA fine-tuning, data handling, and model quantization on Google Colab. Execute the following in Colab:

   ```python
   !pip install torch==2.5.0+cu121 -f https://download.pytorch.org/whl/cu121/torch_stable.html
   !pip install "unsloth[colab-new] @ git+https://github.com/unslothai/unsloth.git"
   !pip install --no-deps xformers "trl<0.9.0" peft accelerate bitsandbytes
   ```

3. **Code Database**: You can use a public code dataset from Hugging Face’s [datasets library](https://huggingface.co/datasets) or your own code dataset.

4. **Google Drive (Optional)**: Mount Google Drive if you're using Colab and need a place to store datasets and model outputs.

   ```python
   from google.colab import drive
   drive.mount('/content/drive')
   ```

5. **Ollama**: Install Ollama for model deployment.

   ```bash
   !curl -fsSL https://ollama.com/install.sh | sh
   ```

### Step 1: Prepare Your Code Dataset

Organize your dataset into **prompt-input-completion** pairs:

- **Prompt**: The task or question, e.g., "Write a function to reverse a string."
- **Input**: Additional context to guide the model, like sample data or requirements.
- **Completion**: The expected solution, such as the completed function code.

This structure enables effective model learning by linking each prompt and input to the correct completion. For more details, refer to the [TRL Dataset Formats Documentation](https://huggingface.co/docs/trl/dataset_formats).

```python
from datasets import load_dataset
from transformers import AutoTokenizer

# Load your dataset - replace `your_code_dataset` with your dataset name or path to your file
# Example: If using a custom CSV file, specify the path as shown below.
dataset = load_dataset("csv", data_files="path/to/your/data.csv")

# Initialize tokenizer (replace with your specific model)
tokenizer = AutoTokenizer.from_pretrained("Qwen/Qwen2.5-Coder-1.5B")

# Define a structured template for formatting
formatted_prompt_template = """Below is an instruction, an input, and a response that completes the request.

### Instruction:
{}

### Input:
{}

### Response:
{}"""

# Define a function to format each example in prompt-input-completion structure
def format_prompt_input_completion_pairs(examples):
    combined_texts = [
        formatted_prompt_template.format(prompt, input_text, completion) + tokenizer.eos_token
        for prompt, input_text, completion in zip(examples["prompt"], examples["input"], examples["completion"])
    ]
    return {"text": combined_texts}

# Apply the formatting function to the dataset in batches for efficiency
formatted_dataset = dataset.map(format_prompt_input_completion_pairs, batched=True)
```

If your code dataset has several files like in a github repository, first convert them into a single text file to streamline preprocessing. To do this, use [Repomix](https://github.com/yamadashy/repomix). With the generated `repomix-output.txt`, create prompt-input-completion pairs by segmenting each function or code block in line with your chosen prompt.

Save the formatted dataset if working on Google Colab with Google Drive:

```python
output_file_path = '/content/drive/MyDrive/formatted_dataset.jsonl'
with open(output_file_path, 'w', encoding='utf-8') as output_file:
    for entry in formatted_dataset:
        json.dump({"text": entry["text"]}, output_file)
        output_file.write('\n')
```

### Step 3: Add LoRA Adapters (Optional for Parameter-Efficient Fine-Tuning)

LoRA (Low-Rank Adaptation) adapters help reduce memory usage and improve training efficiency by modifying specific layers of the model.

```python
from unsloth import FastLanguageModel

model = FastLanguageModel.get_peft_model(
    model,
    r=16,
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
    lora_alpha=8,
    lora_dropout=0.1,
    bias="none",
    use_gradient_checkpointing="unsloth",
    random_state=3407
)
```

### Step 4: Define Training Arguments

Set up your training arguments for fine-tuning. Adjust the following values based on the dataset size, available hardware, and specific requirements.

```python
training_args = TrainingArguments(
    output_dir="./qwen_coder_finetuned",
    evaluation_strategy="epoch",
    learning_rate=2e-5,
    per_device_train_batch_size=2,
    per_device_eval_batch_size=2,
    num_train_epochs=3,
    weight_decay=0.01,
    save_total_limit=2,
    push_to_hub=False,  # Set to True if pushing to Hugging Face hub
)
```

For PEFT models using LoRA, you might want to adjust batch sizes, accumulation steps, and number of epochs to better suit smaller datasets.

```python
training_args = TrainingArguments(
    per_device_train_batch_size=1,
    gradient_accumulation_steps=8,
    num_train_epochs=2,
    learning_rate=5e-5,
    fp16=not is_bfloat16_supported(),
    bf16=is_bfloat16_supported(),
    logging_steps=1,
    optim="adamw_8bit",
    output_dir="outputs",
)
```

### Step 5: Initialize the SFT Trainer

Use the Hugging Face `Trainer` to manage the training process.

```python
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_dataset["train"],
    eval_dataset=tokenized_dataset["validation"],
)
```

For LoRA fine-tuning, use `SFTTrainer` instead:

```python
from trl import SFTTrainer
trainer = SFTTrainer(
    model=model,
    tokenizer=tokenizer,
    train_dataset=formatted_dataset,
    dataset_text_field="text",
    max_seq_length=2048,
)
```

### Step 6: Train the Model

Start the fine-tuning process. This may take some time depending on your dataset size and compute resources.

```python
trainer.train()
```

### Step 7: Evaluate the Model (Optional)

After training, evaluate the model on a test dataset to check its performance.

```python
eval_results = trainer.evaluate()
print(f"Evaluation results: {eval_results}")
```

### Step 8: Save and Export the Model

Save the fine-tuned model to the local disk, or optionally push it to the Hugging Face Hub.

```python
trainer.save_model("path/to/save/qwen_coder_finetuned")
# Optionally, push to Hugging Face Hub if push_to_hub=True in TrainingArguments
# trainer.push_to_hub()
```

### Step 9: Convert to GGUF Format Using `llama.cpp`

To make the fine-tuned model deployable on a variety of platforms, you can convert it to GGUF formats using `llama.cpp`.

```python
    %cd llama.cpp
    !make
    model.push_to_hub_gguf(
        "hf_username/model_name",
        tokenizer=tokenizer,
        quantization_method=["q4_k_m", "q5_k_m", "q8_0", "f16"],
        token="hf_token"
    )
```

For a complete notebook fine-tuning Qwen 2.5 Coder 1.5B, refer to [Fine-Tuning Qwen 2.5 Coder 1.5B](Fine_Tuning_Qwen_2.5_Coder_1.5b.ipynb)

## Cleaning up your Dockerized Cube AI Setup

If you want to stop and remove the Cube AI services, volumes, and networks created during the setup, follow these steps:

First, stop all running containers:

```bash
docker compose down
```

Remove volumes and networks:

```bash
docker compose down --volumes --remove-orphans
```

To clean up the build artifacts and remove compiled files, use:

```bash
make clean
```
