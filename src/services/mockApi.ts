import { v4 as uuidv4 } from 'uuid';
import { Sweet, CreateSweetDto, UpdateSweetDto, SearchParams } from '@/types/sweet.types';
import { User } from '@/types/auth.types';

// --- MOCK DATABASE ---

let sweets: Sweet[] = [
  { id: 1, name: 'Chocolate Fudge Cake', category: 'Cakes', price: 25.99, quantity: 15, description: 'A rich and decadent chocolate fudge cake, perfect for any celebration.', imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=500&q=60', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 2, name: 'Glazed Doughnuts', category: 'Pastries', price: 2.50, quantity: 50, description: 'Classic glazed doughnuts, light, fluffy, and utterly irresistible.', imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=500&q=60', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 3, name: 'Gummy Bears', category: 'Candies', price: 5.00, quantity: 120, description: 'A colorful assortment of fruity gummy bears.', imageUrl: 'https://images.unsplash.com/photo-1580574993627-3a49c78a3908?auto=format&fit=crop&w=500&q=60', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 4, name: 'Strawberry Ice Cream', category: 'Frozen', price: 7.50, quantity: 30, description: 'Creamy strawberry ice cream made with real fruit.', imageUrl: 'https://images.unsplash.com/photo-1580915411954-282cb1b0d780?auto=format&fit=crop&w=500&q=60', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 5, name: 'Red Velvet Cupcakes', category: 'Cakes', price: 4.00, quantity: 24, description: 'Moist red velvet cupcakes with cream cheese frosting.', imageUrl: 'https://images.unsplash.com/photo-1614707267537-78974675b872?auto=format&fit=crop&w=500&q=60', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 6, name: 'Croissants', category: 'Pastries', price: 3.00, quantity: 40, description: 'Buttery, flaky croissants, perfect for breakfast.', imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=500&q=60', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 7, name: 'Lollipops', category: 'Candies', price: 1.50, quantity: 200, description: 'A rainbow of swirly lollipops in various flavors.', imageUrl: 'https://images.unsplash.com/photo-1575849639852-ff4573677446?auto=format&fit=crop&w=500&q=60', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 8, name: 'Mint Chocolate Chip Gelato', category: 'Frozen', price: 8.00, quantity: 25, description: 'Authentic Italian gelato with a refreshing mint flavor and rich chocolate chips.', imageUrl: 'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?auto=format&fit=crop&w=500&q=60', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 9, name: 'Macarons', category: 'Pastries', price: 2.75, quantity: 60, description: 'Delicate and colorful French macarons in assorted flavors.', imageUrl: 'https://images.unsplash.com/photo-1558326567-98ae2405596b?auto=format&fit=crop&w=500&q=60', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 10, name: 'Caramel Popcorn', category: 'Candies', price: 6.25, quantity: 0, description: 'Sweet and crunchy caramel-coated popcorn. Currently out of stock.', imageUrl: 'https://images.unsplash.com/photo-1575379121482-6ce0d3d6242d?auto=format&fit=crop&w=500&q=60', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const users = new Map<string, { user: User; password: string }>([
    ['admin@example.com', { user: { id: 1, email: 'admin@example.com', username: 'Admin', role: 'admin', createdAt: new Date().toISOString() }, password: 'password' }],
    ['user@example.com', { user: { id: 2, email: 'user@example.com', username: 'User', role: 'user', createdAt: new Date().toISOString() }, password: 'password' }],
    ['demo@example.com', { user: { id: 3, email: 'demo@example.com', username: 'Demo User', role: 'user', createdAt: new Date().toISOString() }, password: 'password' }],
]);

let nextSweetId = 11;
let nextUserId = 4;

// --- API SIMULATION HELPERS ---

const simulateNetwork = (data: any, delay = 500) => {
  return new Promise((resolve) => setTimeout(() => resolve(data), delay));
};

const simulateError = (message: string, status = 400, delay = 500) => {
    return new Promise((_, reject) => setTimeout(() => reject({ response: { data: { message }, status } }), delay));
};

// --- AUTH MOCKS ---

export const mockLogin = async (email: string, password: string): Promise<{ user: User; token: string }> => {
    const userData = users.get(email);
    if (userData && userData.password === password) {
        return simulateNetwork({ user: userData.user, token: `mock-token-${uuidv4()}` });
    }
    return simulateError('Invalid email or password', 401);
};

export const mockRegister = async (data: { email: string; password: string; username: string }): Promise<{ user: User; token: string }> => {
    if (users.has(data.email)) {
        return simulateError('This email is already registered.', 409);
    }
    const newUser: User = {
        id: nextUserId++,
        email: data.email,
        username: data.username,
        role: 'user',
        createdAt: new Date().toISOString(),
    };
    users.set(data.email, { user: newUser, password: data.password });
    return simulateNetwork({ user: newUser, token: `mock-token-${uuidv4()}` });
};

// --- SWEETS MOCKS ---

export const mockGetSweets = async (params?: SearchParams): Promise<Sweet[]> => {
    let filteredSweets = [...sweets];
    if (params?.query) {
        const query = params.query.toLowerCase();
        filteredSweets = filteredSweets.filter(s => 
            s.name.toLowerCase().includes(query) || 
            s.description?.toLowerCase().includes(query)
        );
    }
    if (params?.category) {
        filteredSweets = filteredSweets.filter(s => s.category === params.category);
    }
    if (params?.priceRange) {
        filteredSweets = filteredSweets.filter(s => s.price >= params.priceRange![0] && s.price <= params.priceRange![1]);
    }
    return simulateNetwork(filteredSweets);
};

export const mockAddSweet = async (sweetData: CreateSweetDto): Promise<Sweet> => {
    const newSweet: Sweet = {
        ...sweetData,
        id: nextSweetId++,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    sweets.unshift(newSweet);
    return simulateNetwork(newSweet);
};

export const mockUpdateSweet = async (sweetId: number, sweetData: UpdateSweetDto): Promise<Sweet> => {
    const index = sweets.findIndex(s => s.id === sweetId);
    if (index === -1) return simulateError('Sweet not found', 404);
    
    sweets[index] = { ...sweets[index], ...sweetData, updatedAt: new Date().toISOString() };
    return simulateNetwork(sweets[index]);
};

export const mockDeleteSweet = async (sweetId: number): Promise<void> => {
    const index = sweets.findIndex(s => s.id === sweetId);
    if (index === -1) return simulateError('Sweet not found', 404);
    
    sweets.splice(index, 1);
    return simulateNetwork(undefined);
};

export const mockPurchaseSweet = async (sweetId: number, quantity: number): Promise<{ success: boolean }> => {
    const sweet = sweets.find(s => s.id === sweetId);
    if (!sweet) return simulateError('Sweet not found', 404);
    if (sweet.quantity < quantity) return simulateError('Not enough stock available', 400);
    
    sweet.quantity -= quantity;
    sweet.updatedAt = new Date().toISOString();
    return simulateNetwork({ success: true });
};

export const mockUpdateSweetQuantity = async (sweetId: number, newQuantity: number): Promise<Sweet> => {
    const sweet = sweets.find(s => s.id === sweetId);
    if (!sweet) return simulateError('Sweet not found', 404);
    
    sweet.quantity = newQuantity;
    sweet.updatedAt = new Date().toISOString();
    return simulateNetwork(sweet);
};