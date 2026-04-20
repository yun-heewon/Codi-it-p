# 1단계: 빌드 단계
FROM node:22-alpine AS builder

WORKDIR /app

# 의존성 설치
COPY package*.json ./
RUN npm install

# Prisma 스키마 복사 및 Prisma Client 생성
COPY prisma ./prisma/
RUN npx prisma generate

# 소스 복사
COPY . .
RUN npx nest build

# 2단계: 실행 단계
FROM node:22-alpine
WORKDIR /app

# 빌드 결과물 복사
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.env ./.env

EXPOSE 3000

CMD ["node", "dist/main.js"]