# Configuração do Deploy

Este projeto está configurado para fazer deploy automático para o servidor de produção quando houver alterações na branch `main`.

## Pré-requisitos

1. Gerar um par de chaves SSH no seu computador:
```bash
ssh-keygen -t rsa -b 4096 -C "seu@email.com" -f ~/.ssh/coder_challenge_deploy
```

2. Adicionar a chave pública ao servidor:
```bash
ssh-copy-id -i ~/.ssh/coder_challenge_deploy.pub marcosgardinali@74.249.31.172
```

3. Configurar a chave privada no GitHub:
   - Vá para Settings > Secrets and variables > Actions
   - Clique em "New repository secret"
   - Nome: `SSH_PRIVATE_KEY`
   - Valor: Cole o conteúdo do arquivo `~/.ssh/coder_challenge_deploy`

## Como funciona

O workflow faz o seguinte:
1. É acionado quando há um push para a branch `main`
2. Configura o SSH com a chave privada armazenada no GitHub
3. Copia os arquivos para o servidor usando rsync
4. Reconstrói e reinicia os containers Docker

## Estrutura no Servidor

O projeto será deployado em:
```
/home/marcosgardinali/coder-challenge-2025/
```

## Variáveis de Ambiente

As seguintes variáveis de ambiente são necessárias no servidor:
- DATABASE_URL
- JWT_SECRET

Certifique-se de criar um arquivo `.env` no servidor com estas variáveis.