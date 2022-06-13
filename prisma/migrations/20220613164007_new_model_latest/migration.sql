/*
  Warnings:

  - You are about to drop the `TicketSeats` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TicketSeats" DROP CONSTRAINT "TicketSeats_seatId_fkey";

-- DropForeignKey
ALTER TABLE "TicketSeats" DROP CONSTRAINT "TicketSeats_ticketId_fkey";

-- DropTable
DROP TABLE "TicketSeats";

-- CreateTable
CREATE TABLE "_SeatToTicket" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_SeatToTicket_AB_unique" ON "_SeatToTicket"("A", "B");

-- CreateIndex
CREATE INDEX "_SeatToTicket_B_index" ON "_SeatToTicket"("B");

-- AddForeignKey
ALTER TABLE "_SeatToTicket" ADD CONSTRAINT "_SeatToTicket_A_fkey" FOREIGN KEY ("A") REFERENCES "Seat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SeatToTicket" ADD CONSTRAINT "_SeatToTicket_B_fkey" FOREIGN KEY ("B") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;
