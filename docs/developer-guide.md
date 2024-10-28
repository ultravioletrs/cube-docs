# Developer Guide

This guide will help you get started with developing, deploying, and running Cube AI.

## Cloning the Repository

```bash
git clone https://github.com/ultravioletrs/cube.git
cd cube
```

## Pulling Docker Images

```bash
cd cube/docker/
docker compose pull
```

## Running Services with Docker Compose

You can run/start Cube AI services using Docker Compose as described in [this guide](https://github.com/ultravioletrs/cube/blob/main/hal/ubuntu/README.md).

To properly access Cube AI UI deployed on a different server, update the IP address entries in `docker/.env` as described in the above guide to point to your server IP address. The Cube AI UI can then be accessed through your browser at:

```bash
http://<your-server-ip-address>:3001
```

For example, if you have deployed locally, use:

```bash
http://localhost:3001
```

## Open Web UI Integration

Open Web UI is integrated into Cube AI to help in debugging and monitoring key performance metrics of the models, including response token/s, prompt token/s, total duration, and load duration. For more detailed setup and configuration instructions, refer to the [Open Web UI documentation](https://docs.openwebui.com/).

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

## Building Docker Images

You can build the Docker images for Cube AI and related services using the `make` command in the project's root directory.

To build the production Docker image, use:

```bash
make docker
```

For the development Docker image, use:

```bash
make docker-dev
```

## Hardware Abstraction Layer (HAL) for Confidential Computing

For detailed instructions on setting up and building Cube HAL, please refer to [this guide](https://github.com/ultravioletrs/cube/blob/main/hal/buildroot/README.md). It covers:

- Cloning the Buildroot and Cube repositories
- Configuring and building Cube HAL
- Running Cube HAL in a virtual machine

# Fine-Tuning Base Model on Custom Dataset

To enhance the performance of the base model on domain-specific tasks or particular code styles, you may want to fine-tune it on a custom dataset. This process will help adapt the model to your specific requirements.

## Prerequisites

1. **Python Environment**: Ensure you have Python 3.8 or above.

2. **Dependencies**:
   - `transformers`: for model handling. For more information, see the [transformers Documentation](https://huggingface.co/docs/transformers/index).
   - `datasets`: for data handling. For more information, see the [datasets library](https://huggingface.co/docs/datasets/index).
   - `torch`: for model training. Alternative is `TensorFlow` with `Keras`. For more information, see the [TensorFlow Documentation](https://www.tensorflow.org/).
   - `peft`: for parameter-efficient fine-tuning (PEFT) if needed. For more information, see the [PEFT Documentation](https://huggingface.co/docs/peft/index).

3. **Code Database**: You can use a public dataset from Hugging Face’s [datasets library](https://huggingface.co/datasets) or your own dataset.

## Step 1: Prepare Your Code Dataset

The dataset should ideally be in the form of **prompt-completion** pairs, where:
- **Prompt**: Represents the input, such as a function header, code snippet, or a specific code-related query.
- **Completion**: Represents the corresponding code or solution that completes the prompt.

For more information on dataset formats, refer to the [TRL Dataset Formats Documentation](https://huggingface.co/docs/trl/dataset_formats).

You can use `datasets` to load and preprocess the data. Here’s an example setup:

```python
from datasets import load_dataset

# Load your dataset. Replace `your_code_dataset` with your dataset name.
dataset = load_dataset("your_code_dataset")
# Alternatively, load from a CSV file or custom data.
# dataset = load_dataset("csv", data_files="path/to/your/data.csv")

# Preprocess to fit the format expected by the model
def preprocess(example):
    example["text"] = f"Prompt: {example['prompt']} Completion: {example['completion']}"
    return example

dataset = dataset.map(preprocess)
```

## Step 2: Initialize the Model and a Trainer

For demonstration purposes, we will use the Qwen-Coder model here, but you can replace it with any other suitable model from from Hugging Face’s `transformers` library. You can initialize the model with a **Supervised Fine-Tuning (SFT) trainer**, which is suitable for direct input-output training using labeled data. Other trainers are available for different training objectives. For more information on other trainers, see the [TRL Trainer Documentation](https://huggingface.co/docs/trl/main/en/trainer_overview). 

```python
from transformers import AutoModelForCausalLM, AutoTokenizer, TrainingArguments, Trainer

# Load Qwen-Coder model and tokenizer
model_name = "Qwen/Qwen2.5-Coder-1.5B"
model = AutoModelForCausalLM.from_pretrained(model_name)
tokenizer = AutoTokenizer.from_pretrained(model_name)

# Tokenize the dataset
def tokenize_function(examples):
    return tokenizer(examples["text"], truncation=True, padding="max_length", max_length=512)

tokenized_dataset = dataset.map(tokenize_function, batched=True)
```

## Step 3: Define Training Arguments

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

## Step 4: Initialize the SFT Trainer

Use the Hugging Face `Trainer` to manage the training process.

```python
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_dataset["train"],
    eval_dataset=tokenized_dataset["validation"],
)
```

## Step 5: Train the Model

Start the fine-tuning process. This may take some time depending on your dataset size and compute resources.

```python
trainer.train()
```

## Step 6: Evaluate the Model (Optional)

After training, evaluate the model on a test dataset to check its performance.

```python
eval_results = trainer.evaluate()
print(f"Evaluation results: {eval_results}")
```

## Step 7: Save and Export the Model

Save the fine-tuned model to the local disk, or optionally push it to the Hugging Face Hub.

```python
trainer.save_model("path/to/save/qwen_coder_finetuned")
# Optionally, push to Hugging Face Hub if push_to_hub=True in TrainingArguments
# trainer.push_to_hub()
```

## Additional Tips

- **Hyperparameter Tuning**: Experiment with different learning rates, batch sizes, and number of epochs to find the best settings for your task.
- **Parameter-Efficient Fine-Tuning**: If you have limited resources, consider using PEFT (Parameter-Efficient Fine-Tuning) methods like LoRA (Low-Rank Adaptation), available in the `peft` library.
- **GPU Usage**: Use a GPU for faster training. You can enable GPU in the environment with `torch.cuda.is_available()` to verify.

## Cleaning up your Dockerized Cube AI Setup

If you want to stop and remove the Cube AI services, volumes, and networks created during the setup, follow these steps:

First, stop all running containers:

```bash
docker compose down
```

Remove volumes and vetworks:

```bash
docker compose down --volumes --remove-orphans
```

To clean up the build artifacts and remove compiled files, use:

```bash
make clean
```
