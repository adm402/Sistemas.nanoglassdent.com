export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  avatar?: string;
  procedure: string;
  status: 'Concluído' | 'Em Andamento' | 'Crítico' | 'Agendado';
  progress: number; // For the Bio-Status progress glow
  dentist: string;
  lastDate: string;
  notes: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  status: 'Crítico' | 'Alerta' | 'Ideal';
  minStock: number;
  retailer: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  contact: string;
  status: 'Ativo' | 'Em Cirurgia' | 'Ausente';
  avatar: string;
  bio: string;
  specialty: string;
  location: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  category: string;
  type: 'PDF' | 'DOCX' | 'VIDEO' | 'ZIP' | 'XLSX';
  date: string;
  size: string;
  author: string;
}

export interface ExpenseItem {
  id: string;
  description: string;
  category: 'Equipamentos' | 'Materiais' | 'Logística' | 'Eventos' | 'TI' | 'Manutenção';
  amount: number;
  date: string;
  status: 'Aprovado' | 'Pendente' | 'Recusado';
  requestedBy: string;
}

export interface LabOrder {
  id: string;
  patientName: string;
  prosthesisType: string;
  material: string;
  shade: string; // Tooth shade guide (e.g. A1, A2, B1...)
  status: 'Recebido' | 'Modelando' | 'Cozimento' | 'Polimento' | 'Pronto';
  priority: 'Alta' | 'Normal' | 'Urgente';
  technician: string;
  estimatedDelivery: string;
}

export interface SystemAnnouncement {
  id: string;
  author: string;
  role: string;
  text: string;
  time: string;
  likes: number;
}
