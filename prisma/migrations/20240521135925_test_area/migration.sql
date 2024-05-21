-- CreateTable
CREATE TABLE "TestArea" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "requiredValue" TEXT,
    "unit" TEXT,
    "required_1" TEXT,
    "required_2" TEXT,
    "required_3" TEXT,
    "required_4" TEXT,
    "result_1" TEXT,
    "result_2" TEXT,
    "result_3" TEXT,
    "result_4" TEXT,
    "result_5" TEXT,
    "result_6" TEXT,
    "finalControlId" TEXT,

    CONSTRAINT "TestArea_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TestArea" ADD CONSTRAINT "TestArea_finalControlId_fkey" FOREIGN KEY ("finalControlId") REFERENCES "FinalControl"("id") ON DELETE SET NULL ON UPDATE CASCADE;
