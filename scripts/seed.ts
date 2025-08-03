
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar usuários
  console.log('👤 Criando usuários...');
  
  const adminPassword = await bcrypt.hash('johndoe123', 12);
  const receptionistPassword = await bcrypt.hash('maria123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      email: 'john@doe.com',
      password: adminPassword,
      name: 'John Doe',
      role: 'ADMINISTRADOR',
    },
  });

  const receptionist = await prisma.user.upsert({
    where: { email: 'maria@pms.com' },
    update: {},
    create: {
      email: 'maria@pms.com',
      password: receptionistPassword,
      name: 'Maria Silva',
      role: 'RECEPCIONISTA',
    },
  });

  console.log('✅ Usuários criados:', { admin: admin.email, receptionist: receptionist.email });

  // Criar quartos
  console.log('🏨 Criando quartos...');
  
  const rooms = [
    {
      number: '101',
      name: 'Quarto Standard',
      type: 'SOLTEIRO' as const,
      capacity: 1,
      price: 120.00,
      description: 'Quarto aconchegante com uma cama de solteiro, ideal para viajantes sozinhos.',
      amenities: ['Wi-Fi gratuito', 'TV LED', 'Ar condicionado', 'Frigobar'],
      status: 'DISPONIVEL' as const,
    },
    {
      number: '102',
      name: 'Quarto Casal',
      type: 'CASAL' as const,
      capacity: 2,
      price: 180.00,
      description: 'Quarto confortável com cama de casal e vista para a cidade.',
      amenities: ['Wi-Fi gratuito', 'TV LED', 'Ar condicionado', 'Frigobar', 'Cofre'],
      status: 'DISPONIVEL' as const,
    },
    {
      number: '201',
      name: 'Suíte Família',
      type: 'FAMILIA' as const,
      capacity: 4,
      price: 280.00,
      description: 'Suíte espaçosa ideal para famílias, com duas camas e área de estar.',
      amenities: ['Wi-Fi gratuito', 'TV LED', 'Ar condicionado', 'Frigobar', 'Cofre', 'Sofá-cama'],
      status: 'DISPONIVEL' as const,
    },
    {
      number: '202',
      name: 'Suíte Deluxe',
      type: 'SUITE' as const,
      capacity: 2,
      price: 350.00,
      description: 'Suíte luxuosa com vista panorâmica e amenidades premium.',
      amenities: ['Wi-Fi gratuito', 'TV LED', 'Ar condicionado', 'Frigobar', 'Cofre', 'Banheira', 'Varanda'],
      status: 'OCUPADO' as const,
    },
    {
      number: '301',
      name: 'Suíte Presidencial',
      type: 'PRESIDENCIAL' as const,
      capacity: 4,
      price: 550.00,
      description: 'A suíte mais luxuosa do hotel com sala de estar separada e serviço de mordomo.',
      amenities: ['Wi-Fi gratuito', 'TV LED', 'Ar condicionado', 'Frigobar', 'Cofre', 'Banheira', 'Varanda', 'Sala de estar'],
      status: 'MANUTENCAO' as const,
    },
    {
      number: '103',
      name: 'Quarto Executivo',
      type: 'CASAL' as const,
      capacity: 2,
      price: 220.00,
      description: 'Quarto sofisticado ideal para viajantes de negócios.',
      amenities: ['Wi-Fi gratuito', 'TV LED', 'Ar condicionado', 'Frigobar', 'Cofre', 'Mesa de trabalho'],
      status: 'LIMPEZA' as const,
    },
  ];

  const createdRooms = [];
  for (const roomData of rooms) {
    const room = await prisma.room.upsert({
      where: { number: roomData.number },
      update: {},
      create: roomData,
    });
    createdRooms.push(room);
  }

  console.log('✅ Quartos criados:', createdRooms.map(r => r.number).join(', '));

  // Criar hóspedes
  console.log('👥 Criando hóspedes...');
  
  const guests = [
    {
      name: 'Ana Costa',
      email: 'ana.costa@email.com',
      phone: '(11) 99999-1234',
      document: '123.456.789-01',
      documentType: 'CPF',
      address: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
      country: 'Brasil',
      birthDate: new Date('1985-03-15'),
      nationality: 'Brasileira',
      emergencyContact: 'Carlos Costa - (11) 88888-1234',
      notes: 'Cliente VIP, prefere quartos com vista para o mar.',
    },
    {
      name: 'Roberto Santos',
      email: 'roberto.santos@empresa.com',
      phone: '(21) 98765-4321',
      document: '987.654.321-09',
      documentType: 'CPF',
      address: 'Av. Copacabana, 456',
      city: 'Rio de Janeiro',
      state: 'RJ',
      zipCode: '22000-000',
      country: 'Brasil',
      birthDate: new Date('1978-11-22'),
      nationality: 'Brasileira',
      emergencyContact: 'Lucia Santos - (21) 77777-4321',
      notes: 'Viajante de negócios frequente.',
    },
    {
      name: 'James Wilson',
      email: 'james.wilson@company.com',
      phone: '+1 (555) 123-4567',
      document: 'AB1234567',
      documentType: 'PASSAPORTE',
      address: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'Estados Unidos',
      birthDate: new Date('1980-07-10'),
      nationality: 'Americana',
      emergencyContact: 'Susan Wilson - +1 (555) 987-6543',
      notes: 'Turista internacional, fala inglês.',
    },
    {
      name: 'Família Oliveira',
      email: 'familia.oliveira@email.com',
      phone: '(31) 91234-5678',
      document: '456.789.123-45',
      documentType: 'CPF',
      address: 'Rua da Paz, 789',
      city: 'Belo Horizonte',
      state: 'MG',
      zipCode: '30000-000',
      country: 'Brasil',
      birthDate: new Date('1975-09-05'),
      nationality: 'Brasileira',
      emergencyContact: 'Pedro Oliveira - (31) 98765-1234',
      notes: 'Família com duas crianças (8 e 12 anos).',
    },
  ];

  const createdGuests = [];
  for (const guestData of guests) {
    const guest = await prisma.guest.upsert({
      where: { email: guestData.email },
      update: {},
      create: guestData,
    });
    createdGuests.push(guest);
  }

  console.log('✅ Hóspedes criados:', createdGuests.map(g => g.name).join(', '));

  // Criar reservas
  console.log('📅 Criando reservas...');
  
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const reservations = [
    {
      guestId: createdGuests[0].id, // Ana Costa
      roomId: createdRooms[3].id,   // Suíte Deluxe (ocupado)
      checkIn: lastWeek,
      checkOut: nextWeek,
      adults: 2,
      children: 0,
      totalPrice: 2450.00, // 7 dias * 350
      status: 'CHECKIN' as const,
      paymentStatus: 'PAGO' as const,
      source: 'Site oficial',
      notes: 'Lua de mel, decoração especial solicitada.',
      specialRequests: 'Champagne e flores no quarto',
    },
    {
      guestId: createdGuests[1].id, // Roberto Santos
      roomId: createdRooms[1].id,   // Quarto Casal
      checkIn: today,
      checkOut: tomorrow,
      adults: 1,
      children: 0,
      totalPrice: 180.00,
      status: 'CONFIRMADA' as const,
      paymentStatus: 'PENDENTE' as const,
      source: 'Telefone',
      notes: 'Check-in previsto para hoje às 15h.',
      specialRequests: 'Quarto silencioso para trabalho',
    },
    {
      guestId: createdGuests[2].id, // James Wilson
      roomId: createdRooms[0].id,   // Quarto Standard
      checkIn: tomorrow,
      checkOut: new Date(tomorrow.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 dias
      adults: 1,
      children: 0,
      totalPrice: 360.00, // 3 dias * 120
      status: 'CONFIRMADA' as const,
      paymentStatus: 'PARCIAL' as const,
      source: 'Agência de viagens',
      notes: 'Turista internacional, chegada do aeroporto.',
      specialRequests: 'Transfer do aeroporto',
    },
    {
      guestId: createdGuests[3].id, // Família Oliveira
      roomId: createdRooms[2].id,   // Suíte Família
      checkIn: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000), // daqui a 2 dias
      checkOut: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000), // daqui a 5 dias
      adults: 2,
      children: 2,
      totalPrice: 840.00, // 3 dias * 280
      status: 'CONFIRMADA' as const,
      paymentStatus: 'PENDENTE' as const,
      source: 'Balcão',
      notes: 'Família com crianças, necessário berço extra.',
      specialRequests: 'Berço para bebê, cadeira alta no restaurante',
    },
  ];

  const createdReservations = [];
  for (const reservationData of reservations) {
    const reservation = await prisma.reservation.create({
      data: reservationData,
      include: {
        guest: true,
        room: true,
      },
    });
    createdReservations.push(reservation);
  }

  console.log('✅ Reservas criadas:', createdReservations.map(r => `${r.guest.name} - Quarto ${r.room.number}`).join(', '));

  console.log('🎉 Seed concluído com sucesso!');
  console.log('\n📊 Resumo:');
  console.log(`- ${createdRooms.length} quartos criados`);
  console.log(`- ${createdGuests.length} hóspedes criados`);
  console.log(`- ${createdReservations.length} reservas criadas`);
  console.log(`- 2 usuários criados (1 admin, 1 recepcionista)`);
  console.log('\n🔐 Credenciais de acesso:');
  console.log('Admin: john@doe.com / johndoe123');
  console.log('Recepcionista: maria@pms.com / maria123');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
