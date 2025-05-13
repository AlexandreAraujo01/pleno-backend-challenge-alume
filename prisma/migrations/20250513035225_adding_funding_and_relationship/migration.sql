-- CreateTable
CREATE TABLE "fundings" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "total_value" DOUBLE PRECISION NOT NULL,
    "installment_quantity" INTEGER NOT NULL,
    "monthly_interest" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "fundings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "fundings" ADD CONSTRAINT "fundings_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
