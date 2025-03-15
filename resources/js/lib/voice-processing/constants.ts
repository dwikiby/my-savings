export const INCOME_PATTERNS = ['terima', 'pendapatan', 'pemasukan'];
export const EXPENSE_PATTERNS = ['belanja', 'bayar', 'pengeluaran', 'beli', 'makan'];

export const CATEGORY_MAPPING = {
    income: {
        Salary: ['gaji', 'upah', 'salary'],
        Freelance: ['freelance', 'proyek', 'project', 'desain'],
        Investments: ['investasi', 'saham', 'dividend', 'bunga'],
        'Other Income': ['bonus', 'hadiah', 'pemberian'],
    },
    expense: {
        Food: ['makanan', 'makan', 'restoran', 'cafe', 'kopi', 'snack', 'jajan'],
        Transportation: ['bensin', 'parkir', 'transportasi', 'taksi', 'ojek', 'bus', 'kereta'],
        Utilities: ['listrik', 'air', 'internet', 'pulsa', 'wifi', 'gas'],
        Shopping: ['beli', 'belanja', 'mall', 'toko', 'baju', 'sepatu'],
        Entertainment: ['hiburan', 'film', 'bioskop', 'game', 'musik'],
        'Other Expenses': ['lainnya', 'other'],
    },
};
