FROM node:20-alpine

WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o resto do código
COPY . .

# Expõe a porta do Vite
EXPOSE 5173

# O --host é obrigatório para o Docker deixar a gente acessar pelo navegador
CMD ["npm", "run", "dev", "--", "--host"]
