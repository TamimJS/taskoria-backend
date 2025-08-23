-- CreateIndex
CREATE INDEX "refresh_tokens_userId_revoked_idx" ON "public"."refresh_tokens"("userId", "revoked");

-- CreateIndex
CREATE INDEX "refresh_tokens_token_idx" ON "public"."refresh_tokens"("token");

-- CreateIndex
CREATE INDEX "refresh_tokens_expiresAt_idx" ON "public"."refresh_tokens"("expiresAt");

-- CreateIndex
CREATE INDEX "refresh_tokens_createdAt_idx" ON "public"."refresh_tokens"("createdAt");

-- CreateIndex
CREATE INDEX "users_isActive_idx" ON "public"."users"("isActive");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "public"."users"("role");

-- CreateIndex
CREATE INDEX "users_createdAt_idx" ON "public"."users"("createdAt");

-- CreateIndex
CREATE INDEX "users_firstName_lastName_idx" ON "public"."users"("firstName", "lastName");

-- CreateIndex
CREATE INDEX "users_email_isActive_idx" ON "public"."users"("email", "isActive");
