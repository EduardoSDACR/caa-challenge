-- CreateTable
CREATE TABLE "analisis_comentarios" (
    "id" SERIAL NOT NULL,
    "id_comentario" INTEGER NOT NULL,
    "id_candidato" INTEGER NOT NULL,
    "score_sentimiento" DECIMAL(5,2) NOT NULL,
    "id_posicion" INTEGER NOT NULL,

    CONSTRAINT "analisis_comentarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analisis_transcripciones" (
    "id" SERIAL NOT NULL,
    "id_scrapper_result" INTEGER NOT NULL,
    "id_candidato" INTEGER NOT NULL,
    "id_posicion" INTEGER NOT NULL,
    "score_sentimientos" DECIMAL(5,2) NOT NULL,
    "resumen" TEXT,

    CONSTRAINT "analisis_transcripciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "candidatos" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "partido_politico" VARCHAR(150) NOT NULL,

    CONSTRAINT "candidatos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channels" (
    "id" SERIAL NOT NULL,
    "social_network_id" INTEGER NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" SERIAL NOT NULL,
    "scrapper_result_id" INTEGER NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "content" TEXT NOT NULL,
    "like_count" INTEGER DEFAULT 0,
    "date_at" DATE,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "keyword_comentarios" (
    "id" SERIAL NOT NULL,
    "id_comentario" INTEGER NOT NULL,
    "id_keyword" INTEGER NOT NULL,

    CONSTRAINT "keyword_comentarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "keyword_transcripciones" (
    "id" SERIAL NOT NULL,
    "id_scrapper_result" INTEGER NOT NULL,
    "id_keyword" INTEGER NOT NULL,

    CONSTRAINT "keyword_transcripciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "keywords" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "keywords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posicion" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "descripcion" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "posicion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scrapper_results" (
    "id" SERIAL NOT NULL,
    "channel_id" INTEGER NOT NULL,
    "comment_count" INTEGER DEFAULT 0,
    "like_count" INTEGER DEFAULT 0,
    "view_count" INTEGER DEFAULT 0,
    "scraped_at" TIMESTAMP(6) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "transcript" TEXT,
    "video_id" VARCHAR,

    CONSTRAINT "scrapper_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_networks" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "social_network_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "keywords_nombre_key" ON "keywords"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "posicion_nombre_key" ON "posicion"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "social_network_nombre_key" ON "social_networks"("name");

-- AddForeignKey
ALTER TABLE "analisis_comentarios" ADD CONSTRAINT "fk_comentario_analisis" FOREIGN KEY ("id_comentario") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "analisis_comentarios" ADD CONSTRAINT "fk_comentario_candidato" FOREIGN KEY ("id_candidato") REFERENCES "candidatos"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "analisis_comentarios" ADD CONSTRAINT "fk_comentario_posicion" FOREIGN KEY ("id_posicion") REFERENCES "posicion"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "analisis_transcripciones" ADD CONSTRAINT "fk_transcripciones_candidato" FOREIGN KEY ("id_candidato") REFERENCES "candidatos"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "analisis_transcripciones" ADD CONSTRAINT "fk_transcripciones_posicion" FOREIGN KEY ("id_posicion") REFERENCES "posicion"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "analisis_transcripciones" ADD CONSTRAINT "fk_transcripciones_scrapper" FOREIGN KEY ("id_scrapper_result") REFERENCES "scrapper_results"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "channels" ADD CONSTRAINT "fk_channels_social_network" FOREIGN KEY ("social_network_id") REFERENCES "social_networks"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_scrapper_result_id_fkey" FOREIGN KEY ("scrapper_result_id") REFERENCES "scrapper_results"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "keyword_comentarios" ADD CONSTRAINT "fk_keyword_comentario" FOREIGN KEY ("id_comentario") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "keyword_comentarios" ADD CONSTRAINT "fk_keyword_keyword" FOREIGN KEY ("id_keyword") REFERENCES "keywords"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "keyword_transcripciones" ADD CONSTRAINT "fk_keyword_keyword_transcripcion" FOREIGN KEY ("id_keyword") REFERENCES "keywords"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "keyword_transcripciones" ADD CONSTRAINT "fk_keyword_scrapper_result" FOREIGN KEY ("id_scrapper_result") REFERENCES "scrapper_results"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "scrapper_results" ADD CONSTRAINT "scrapper_results_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "channels"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

