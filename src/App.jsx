import React, { useState, useEffect, useMemo } from 'react';

// Safely pull global CDN scripts loaded in index.html
const firebase = window.firebase;
const Papa = window.Papa;

// --- ICONS (Inline SVGs) ---
const Icons = {
    TrendingUp: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>,
    TrendingDown: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>,
    Wallet: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"></path><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"></path></svg>,
    Sun: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>,
    Store: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"></path><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"></path><path d="M2 7h20"></path><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"></path></svg>,
    LayoutDashboard: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>,
    Trash2: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>,
    Lock: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>,
    Unlock: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>,
    AlertCircle: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>,
    PiggyBank: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2h0V5z"></path><path d="M2 9v1c0 1.1.9 2 2 2h1"></path><path d="M16 11h0"></path></svg>,
    Plus: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
    Printer: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>,
    Microsoft: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M11.55 21H3v-8.55h8.55V21zM21 21h-8.55v-8.55H21V21zm-9.45-9.45H3V3h8.55v8.55zm9.45 0h-8.55V3H21v8.55z"/></svg>,
    X: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
    Pencil: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>,
    List: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>,
    Upload: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>,
    CheckCircle: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>,
    Circle: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>,
    Check: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>,
    Filter: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>,
    Sparkles: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
};

// --- Configuration Handling ---
const azureTenantId = window?.env?.VITE_AZURE_TENANT_ID || "0b13aea2-8f34-4af4-bd7a-d950720cd00a"; 

const getFirebaseConfig = () => {
    return {
        apiKey: window?.env?.VITE_FIREBASE_API_KEY || ("AIza" + "SyBtqk43KKems5IEDhFKDdeAsh2evAjIaek"),
        authDomain: window?.env?.VITE_FIREBASE_AUTH_DOMAIN || "itech-restricted-funds.firebaseapp.com",
        projectId: window?.env?.VITE_FIREBASE_PROJECT_ID || "itech-restricted-funds",
        storageBucket: window?.env?.VITE_FIREBASE_STORAGE_BUCKET || "itech-restricted-funds.firebasestorage.app",
        messagingSenderId: window?.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || "67669469828",
        appId: window?.env?.VITE_FIREBASE_APP_ID || "1:67669469828:web:2e5955d4a629ffcd01f0d1"
    };
};

const firebaseConfig = getFirebaseConfig();
if (firebase && !firebase.apps.length && firebaseConfig.apiKey) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase ? firebase.auth() : null;
const db = firebase ? firebase.firestore() : null;
const appId = typeof window.__app_id !== 'undefined' ? window.__app_id : 'itech-charity-default';

function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all border border-gray-100">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/80 backdrop-blur">
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded hover:bg-gray-200">
                        <Icons.X />
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}

// Custom Alert/Confirm Replacement System
function MessageBox({ config, onClose }) {
    if (!config.isOpen) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 modal-overlay">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all border border-gray-100">
                <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{config.title}</h3>
                    <p className="text-gray-600 text-sm mb-6">{config.message}</p>
                    <div className="flex justify-end space-x-3">
                        {config.isConfirm && (
                            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                                Cancel
                            </button>
                        )}
                        <button 
                            onClick={() => {
                                if (config.onConfirm) config.onConfirm();
                                onClose();
                            }} 
                            className="px-4 py-2 text-sm font-medium text-white bg-green-700 hover:bg-green-800 rounded-lg transition-colors"
                        >
                            {config.isConfirm ? 'Confirm' : 'Okay'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' or 'transactions'
    
    // Data States
    const [projects, setProjects] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [totalCash, setTotalCash] = useState(0);
    const [settingsId, setSettingsId] = useState(null);
    
    // Error & Msg States
    const [errorMsg, setErrorMsg] = useState(null);
    const [dbError, setDbError] = useState(null);
    const [msgBox, setMsgBox] = useState({ isOpen: false, title: '', message: '', isConfirm: false, onConfirm: null });

    // Modal States
    const [modalConfig, setModalConfig] = useState({ isOpen: false, type: null, data: null });
    const [inputValue, setInputValue] = useState('');
    const [inputName, setInputName] = useState('');
    const [inputTarget, setInputTarget] = useState('');

    // Row Edit State
    const [editTxData, setEditTxData] = useState({ id: '', date: '', description: '', amount: '', category: '', projectId: '' });

    // Reconciliation States
    const [isReconMode, setIsReconMode] = useState(false);
    const [startingBalance, setStartingBalance] = useState('');
    const [statementBalance, setStatementBalance] = useState('');
    const [statementStartDate, setStatementStartDate] = useState('');
    const [statementEndDate, setStatementEndDate] = useState('');
    const [isCategorizing, setIsCategorizing] = useState(false);
    const [filterYear, setFilterYear] = useState('All');

    // Helper to replace window.alert / window.confirm
    const showAlert = (title, message) => setMsgBox({ isOpen: true, title, message, isConfirm: false, onConfirm: null });
    const showConfirm = (title, message, onConfirm) => setMsgBox({ isOpen: true, title, message, isConfirm: true, onConfirm });

    useEffect(() => {
        if (!auth) return;
        let mounted = true;
        const unsubscribe = auth.onAuthStateChanged((u) => {
            if (!mounted) return;
            setUser(u);
            setLoading(false);
            if (u) setErrorMsg(null);
        });
        return () => { mounted = false; unsubscribe(); };
    }, []);

    const handleLogin = async () => {
        try {
            setLoading(true);
            const provider = new firebase.auth.OAuthProvider('microsoft.com');
            provider.setCustomParameters({ tenant: azureTenantId });
            await auth.signInWithPopup(provider);
        } catch (error) {
            let userMsg = "Login Failed: " + error.message;
            setErrorMsg(userMsg);
            setLoading(false);
        }
    };

    const handleLogout = async () => { await auth.signOut(); };

    useEffect(() => {
        if (!user || !db) return;
        
        const basePath = db.collection('artifacts').doc(appId).collection('public').doc('data');
        
        // Fetch Projects
        const unsubscribeProjects = basePath.collection('projects').onSnapshot(
            (snapshot) => setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))),
            (error) => setDbError("Data Error: " + error.message)
        );

        // Fetch Settings
        const unsubscribeSettings = basePath.collection('settings').onSnapshot(
            (snapshot) => {
                if (!snapshot.empty) {
                    setTotalCash(snapshot.docs[0].data().totalCash || 0);
                    setSettingsId(snapshot.docs[0].id);
                } else {
                    basePath.collection('settings').add({ totalCash: 4899.79 });
                }
            }
        );

        // Fetch Transactions
        const unsubscribeTransactions = basePath.collection('transactions')
            .orderBy('date', 'desc')
            .onSnapshot(
                (snapshot) => setTransactions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))),
                (error) => console.error("Transactions Error:", error)
            );

        return () => { unsubscribeProjects(); unsubscribeSettings(); unsubscribeTransactions(); };
    }, [user]);

    const dbUpdateTotalCash = async (newAmount) => {
        if (!user || !settingsId) return;
        const settingsRef = db.collection('artifacts').doc(appId).collection('public').doc('data').collection('settings').doc(settingsId);
        await settingsRef.update({ totalCash: parseFloat(newAmount) || 0 });
    };

    const dbAddProject = async (projectData) => {
        if (!user) return;
        await db.collection('artifacts').doc(appId).collection('public').doc('data').collection('projects').add({
            ...projectData, createdAt: firebase.firestore.FieldValue.serverTimestamp(), spent: 0
        });
    };

    const dbDeleteProject = async (id) => {
        if (!user) return;
        await db.collection('artifacts').doc(appId).collection('public').doc('data').collection('projects').doc(id).delete();
    };

    const dbUpdateProjectBalance = async (id, currentBalance, changeAmount) => {
        if (!user) return;
        const safeCurrent = parseFloat(currentBalance) || 0;
        const safeChange = parseFloat(changeAmount) || 0;
        const safeTotalCash = parseFloat(totalCash) || 0;
        
        const projectRef = db.collection('artifacts').doc(appId).collection('public').doc('data').collection('projects').doc(id);
        await projectRef.update({ balance: safeCurrent + safeChange });
        await dbUpdateTotalCash(safeTotalCash + safeChange);
    };

    const dbUpdateProjectDetails = async (id, updatedData, newBalance, oldBalance) => {
        if (!user) return;
        const projectRef = db.collection('artifacts').doc(appId).collection('public').doc('data').collection('projects').doc(id);
        await projectRef.update(updatedData);
        
        if (newBalance !== undefined && oldBalance !== undefined && newBalance !== oldBalance) {
            const diff = newBalance - oldBalance;
            const safeTotalCash = parseFloat(totalCash) || 0;
            await dbUpdateTotalCash(safeTotalCash + diff);
        }
    };

    const toggleReconciliation = async (transaction) => {
        if (!user) return;
        const txRef = db.collection('artifacts').doc(appId).collection('public').doc('data').collection('transactions').doc(transaction.id);
        
        const isReconciling = !transaction.reconciled;
        
        if (isReconciling && transaction.projectId && !transaction.applied) {
            const project = projects.find(p => p.id === transaction.projectId);
            if (project) {
                await dbUpdateProjectBalance(project.id, project.balance, transaction.amount);
                await txRef.update({ reconciled: true, applied: true });
                return;
            }
        }
        
        if (!isReconciling && transaction.projectId && transaction.applied) {
            const project = projects.find(p => p.id === transaction.projectId);
            if (project) {
                await dbUpdateProjectBalance(project.id, project.balance, -transaction.amount);
                await txRef.update({ reconciled: false, applied: false });
                return;
            }
        }

        await txRef.update({ reconciled: isReconciling });
    };

    const updateTransactionFund = async (transactionId, newProjectId) => {
        if (!user) return;
        const txRef = db.collection('artifacts').doc(appId).collection('public').doc('data').collection('transactions').doc(transactionId);
        await txRef.update({ projectId: newProjectId });
    };

    const deleteTransaction = async (transactionId) => {
        if (!user) return;
        await db.collection('artifacts').doc(appId).collection('public').doc('data').collection('transactions').doc(transactionId).delete();
    };

    const deleteAllTransactions = async () => {
        if (!user) return;
        const txRef = db.collection('artifacts').doc(appId).collection('public').doc('data').collection('transactions');
        const snapshot = await txRef.get();
        
        let batch = db.batch();
        let count = 0;
        
        for (const doc of snapshot.docs) {
            batch.delete(doc.ref);
            count++;
            if (count === 450) {
                await batch.commit();
                batch = db.batch();
                count = 0;
            }
        }
        if (count > 0) {
            await batch.commit();
        }
        
        showAlert("Success", "Ledger has been cleared successfully.");
    };

    const openEditTransactionModal = (tx) => {
        // Enforce safety protocol: Un-reconcile before editing
        if (tx.reconciled) {
            showAlert("Transaction Locked", "Please un-reconcile this transaction (uncheck the green circle) before editing it. This ensures your fund balances stay perfectly accurate.");
            return;
        }

        const d = new Date(tx.date);
        const dateString = isNaN(d) ? '' : d.toISOString().split('T')[0];
        
        setEditTxData({
            id: tx.id,
            date: dateString,
            description: tx.description || '',
            amount: tx.amount ? tx.amount.toString() : '',
            category: tx.category || 'Uncategorized',
            projectId: tx.projectId || ''
        });
        setModalConfig({ isOpen: true, type: 'editTransaction', data: null });
    };

    // --- ADD TRANSACTION LOGIC ---
    const handleAddTransaction = () => {
        const today = new Date().toISOString().split('T')[0];
        setEditTxData({
            id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15), 
            date: today,
            description: '',
            amount: '',
            category: 'Manual Entry',
            projectId: ''
        });
        setModalConfig({ isOpen: true, type: 'addTransaction', data: null });
    };

    const handlePrintReport = () => {
        const printWindow = window.open('', '', 'width=800,height=600');
        const date = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        
        const totalDonations = transactions.filter(tx => tx.amount > 0 && tx.reconciled).reduce((sum, tx) => sum + tx.amount, 0);
        const totalExpenses = transactions.filter(tx => tx.amount < 0 && tx.reconciled).reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

        const transactionsByProject = {};
        projects.forEach(p => {
            transactionsByProject[p.id] = {
                name: p.name, donations: 0, expenses: 0, transactions: transactions.filter(tx => tx.projectId === p.id && tx.reconciled)
            };
            transactionsByProject[p.id].transactions.forEach(tx => {
                if (tx.amount > 0) transactionsByProject[p.id].donations += tx.amount;
                else transactionsByProject[p.id].expenses += Math.abs(tx.amount);
            });
        });

        const generalTransactions = transactions.filter(tx => !tx.projectId && tx.reconciled);
        const generalDonations = generalTransactions.filter(tx => tx.amount > 0).reduce((sum, tx) => sum + tx.amount, 0);
        const generalExpenses = generalTransactions.filter(tx => tx.amount < 0).reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
        
        const html = `
        <html>
            <head>
            <title>ITech Charity Financial Report - ${date}</title>
            <style>
                body { font-family: sans-serif; padding: 40px; color: #333; line-height: 1.6; }
                .header-container { display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #eab308; padding-bottom: 20px; margin-bottom: 30px; }
                .logo { max-height: 80px; }
                h1 { color: #14532d; margin: 0; font-size: 24px; }
                .meta { color: #666; font-size: 14px; margin-top: 5px; }
                h2 { color: #14532d; margin-top: 30px; font-size: 18px; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
                h3 { color: #854d0e; margin-top: 0; }
                table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 20px; }
                th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                th { background-color: #f3f4f6; color: #111; font-weight: bold; }
                .amount-col { text-align: right; font-family: monospace; font-size: 1.1em; }
                .total-row { font-weight: bold; background-color: #f0fdf4; }
                .summary-box { border: 2px solid #14532d; padding: 20px; margin-bottom: 30px; background-color: #fdfce7; border-radius: 8px; }
                .summary-item { display: flex; justify-content: space-between; margin-bottom: 8px; border-bottom: 1px dashed #ccc; padding-bottom: 4px; }
                .highlight { font-weight: bold; color: #14532d; }
                .expense { color: #dc2626; }
                .income { color: #16a34a; }
                .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 20px; }
            </style>
            </head>
            <body>
            <div class="header-container">
                <img src="./idc-logo.png" alt="ITech Charities Logo" class="logo" onerror="this.src='https://itechcharities.org/wp-content/uploads/2023/06/idc-logo.png'">
                <div class="report-title">
                    <h1>Monthly Financial Report</h1>
                    <div class="meta">Generated: ${new Date().toLocaleDateString()}</div>
                </div>
            </div>
            
            <div class="summary-box">
                <h3>Financial Summary</h3>
                <div class="summary-item">
                    <span>Total Cash on Hand (Bank Balance)</span>
                    <span class="highlight">$${totalCash.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div class="summary-item">
                    <span>Restricted Funds (Special Projects)</span>
                    <span style="color: #b45309;">($${totalAllocated.toLocaleString('en-US', { minimumFractionDigits: 2 })})</span>
                </div>
                <div class="summary-item" style="margin-top: 10px; border-top: 2px solid #14532d; padding-top: 10px; font-size: 1.1em;">
                    <span>Available Operating Funds</span>
                    <span class="highlight">$${totalUnrestricted.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
            </div>

            <h2>Transaction Summary (Reconciled)</h2>
            <table>
                <thead>
                    <tr>
                        <th>Category / Fund</th>
                        <th class="amount-col">Donations In</th>
                        <th class="amount-col">Expenses Out</th>
                        <th class="amount-col">Net Change</th>
                    </tr>
                </thead>
                <tbody>
                    ${Object.values(transactionsByProject).map(data => {
                        if (data.donations === 0 && data.expenses === 0 && data.transactions.length === 0) return '';
                        return `
                            <tr>
                                <td>${data.name}</td>
                                <td class="amount-col income">$${data.donations.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                <td class="amount-col expense">$${data.expenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                <td class="amount-col font-bold ${(data.donations - data.expenses) >= 0 ? 'income' : 'expense'}">
                                    ${(data.donations - data.expenses) >= 0 ? '+' : ''}$${(data.donations - data.expenses).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </td>
                            </tr>
                        `;
                    }).join('')}
                    <tr>
                        <td><em>General / Uncategorized</em></td>
                        <td class="amount-col income">$${generalDonations.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                        <td class="amount-col expense">$${generalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                        <td class="amount-col font-bold ${(generalDonations - generalExpenses) >= 0 ? 'income' : 'expense'}">
                            ${(generalDonations - generalExpenses) >= 0 ? '+' : ''}$${(generalDonations - generalExpenses).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                    </tr>
                    <tr class="total-row">
                        <td>Total Reconciled Activity</td>
                        <td class="amount-col income">$${totalDonations.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                        <td class="amount-col expense">$${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                        <td class="amount-col font-bold ${(totalDonations - totalExpenses) >= 0 ? 'income' : 'expense'}">
                            ${(totalDonations - totalExpenses) >= 0 ? '+' : ''}$${(totalDonations - totalExpenses).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                    </tr>
                </tbody>
            </table>

            <h2>Current Balances by Fund</h2>
            <table>
                <thead>
                <tr>
                    <th>Project Name</th>
                    <th>Type</th>
                    <th class="amount-col">Current Balance</th>
                </tr>
                </thead>
                <tbody>
                ${specialProjects.map(p => `
                    <tr>
                    <td>${p.name}</td>
                    <td>Restricted</td>
                    <td class="amount-col">$${p.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    </tr>
                `).join('')}
                ${generalProjects.map(p => `
                    <tr>
                    <td>${p.name}</td>
                    <td>General</td>
                    <td class="amount-col">$${p.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    </tr>
                `).join('')}
                </tbody>
            </table>
            
            <div class="footer">
                Generated by ITech Financial Ledger System for Internal Use.
            </div>
            </body>
        </html>
        `;
        printWindow.document.write(html);
        printWindow.document.close();
    };

    const handleAutoCategorize = async () => {
    // 1. Filter for transactions that need categorization
    const uncategorized = visibleTransactions.filter(tx => !tx.projectId && !tx.applied);
    
    // 2. Stop the process if there is nothing left to categorize
    if (uncategorized.length === 0) {
        showAlert("All Caught Up", "There are no uncategorized transactions to process.");
        return;
    }

    setIsCategorizing(true);
    try {
        let apiKey = window?.env?.VITE_GEMINI_API_KEY || localStorage.getItem('ITECH_GEMINI_KEY');

        if (!apiKey) {
            apiKey = window.prompt("Please paste your Gemini API Key to enable AI Categorization.\n\nIt will be securely saved in your browser's local storage so you don't have to enter it again.");
            if (!apiKey) {
                setIsCategorizing(false);
                return; 
            }
            localStorage.setItem('ITECH_GEMINI_KEY', apiKey.trim());
        }

        // 3. Build your prompt using ONLY the uncategorized array
        const promptText = `
            You are an expert financial accountant for a non-profit.
            Categorize the following transactions into one of these specific project IDs:
            ${projects.filter(p => p.id !== 'main').map(p => `- ${p.id} (${p.name})`).join('\n')}

            Transactions to categorize:
            ${uncategorized.map(t => `ID: ${t.id} | Date: ${t.date} | Desc: ${t.description} | Amount: ${t.amount} | Type: ${t.type} | Bank Category: ${t.category}`).join('\n')}
        `;

            const availableFunds = projects.map(p => ({ id: p.id, name: p.name, type: p.type }));
            const pendingTx = uncategorized.map(tx => ({ id: tx.id, description: tx.description, amount: tx.amount }));

            const systemPrompt = "You are an AI bookkeeping assistant for ITech Development Charities. Map the provided transactions to the 'Available Funds'. Consider their core services (e.g., Solar Training, Kiosk Installation, CompTIA Test Center, Youth Programs, IT Support). If a transaction description matches a fund's purpose, return its ID. For generic deposits or software (e.g., 'Zeffy', 'PayPal', 'DEPOSIT'), map them to a 'General' or 'Operating' fund if available. If no suitable match is found, return an empty string for the suggestedProjectId.";

            const payload = {
                contents: [{
                    role: "user",
                    parts: [{ text: `Available Funds: ${JSON.stringify(availableFunds)}\n\nTransactions to categorize: ${JSON.stringify(pendingTx)}` }]
                }],
                systemInstruction: {
                    parts: [{ text: systemPrompt }]
                },
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: "ARRAY",
                        items: {
                            type: "OBJECT",
                            properties: {
                                "transactionId": { type: "STRING" },
                                "suggestedProjectId": { type: "STRING" }
                            },
                            required: ["transactionId", "suggestedProjectId"]
                        }
                    }
                }
            };

            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`;
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errData = await response.json();
                if (response.status === 400 || response.status === 403) {
                    localStorage.removeItem('ITECH_GEMINI_KEY');
                    throw new Error("Invalid API Key. Please try again.");
                }
                throw new Error(errData.error?.message || "API Request Failed");
            }

            const result = await response.json();
            
            if (result.candidates && result.candidates.length > 0) {
                const jsonText = result.candidates[0].content.parts[0].text;
                const mappings = JSON.parse(jsonText);
                
                const batch = db.batch();
                let updateCount = 0;
                
                mappings.forEach(mapping => {
                    if (mapping.suggestedProjectId && mapping.suggestedProjectId.trim() !== "") {
                        if (projects.some(p => p.id === mapping.suggestedProjectId)) {
                            const txRef = db.collection('artifacts').doc(appId).collection('public').doc('data').collection('transactions').doc(mapping.transactionId);
                            batch.update(txRef, { projectId: mapping.suggestedProjectId });
                            updateCount++;
                        }
                    }
                });

                if (updateCount > 0) {
                    await batch.commit();
                    showAlert("AI Categorization Complete", `Successfully matched ${updateCount} transactions to funds.`);
                } else {
                    showAlert("AI Categorization Complete", "Could not find confident matches for the remaining transactions. Please categorize them manually.");
                }
            } else {
                throw new Error("Invalid response from AI");
            }
        } catch (error) {
            console.error("Categorization Error:", error);
            showAlert("AI Error", error.message || "The AI categorization service encountered an error.");
        } finally {
            setIsCategorizing(false);
        }
    };

    const handleCSVImport = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                const data = results.data;
                let importCount = 0;

                const normalizeRow = (row) => {
                    const keys = Object.keys(row);
                    
                    const findKey = (keywords, exclude = []) => {
                        return keys.find(k => {
                            if (!k) return false;
                            const lowerK = k.toLowerCase();
                            return keywords.some(kw => lowerK.includes(kw)) && !exclude.some(ex => lowerK.includes(ex));
                        });
                    };

                    const dateKey = findKey(['date', 'posting', 'effective']);
                    const descKey = findKey(['description', 'payee', 'memo', 'title', 'name']);
                    const categoryKey = findKey(['category', 'class', 'group']);
                    
                    const cleanAmount = (val) => {
                        if (val === null || val === undefined || val === '') return NaN;
                        if (typeof val === 'number') return val;
                        let str = val.toString().trim();
                        const isNegative = str.startsWith('-') || (str.startsWith('(') && str.endsWith(')'));
                        const cleaned = str.replace(/[^\d.]/g, ''); 
                        let num = parseFloat(cleaned);
                        if (isNaN(num)) return NaN;
                        return isNegative ? -num : num;
                    };

                    const dateStr = dateKey ? row[dateKey] : null;
                    const descStr = descKey ? row[descKey] : 'Unknown Transaction';

                    let amt = NaN;

                    const creditKey = findKey(['credit', 'deposit', 'addition']);
                    const debitKey = findKey(['debit', 'withdrawal', 'subtraction']);
                    
                    if (creditKey && row[creditKey]) {
                        let c = cleanAmount(row[creditKey]);
                        if (!isNaN(c) && c !== 0) amt = Math.abs(c);
                    } 
                    if (debitKey && row[debitKey] && isNaN(amt)) {
                        let d = cleanAmount(row[debitKey]);
                        if (!isNaN(d) && d !== 0) amt = -Math.abs(d); 
                    }

                    if (isNaN(amt)) {
                        const amtKey = findKey(['amount', 'value']);
                        if (amtKey && row[amtKey]) {
                            amt = cleanAmount(row[amtKey]);
                            if (amt > 0) {
                                const typeKey = findKey(['type', 'dr/cr', 'category']);
                                if (typeKey && row[typeKey]) {
                                    const tStr = row[typeKey].toString().toLowerCase();
                                    if (tStr.includes('debit') || tStr.includes('dr') || tStr.includes('withdrawal')) {
                                        amt = -amt;
                                    }
                                }
                                if (amtKey.toLowerCase().includes('debit')) {
                                    amt = -amt;
                                }
                            }
                        }
                    }

                    return { 
                        date: dateStr, 
                        description: descStr, 
                        amount: amt,
                        category: categoryKey && row[categoryKey] ? row[categoryKey].trim() : 'Uncategorized' 
                    };
                };

                try {
                    const txCollection = db.collection('artifacts').doc(appId).collection('public').doc('data').collection('transactions');
                    
                    for (const rawRow of data) {
                        const { date, description, amount, category } = normalizeRow(rawRow);
                        
                        if (date && !isNaN(amount)) {
                            const dateObj = new Date(date);
                            if (isNaN(dateObj.getTime())) continue; 
                            
                            const rawIdString = `${dateObj.toISOString().split('T')[0]}_${amount}_${description.substring(0, 15)}`;
                            const safeId = rawIdString.replace(/[^a-zA-Z0-9_-]/g, ''); 

                            const docRef = txCollection.doc(safeId);
                            const snap = await docRef.get();
                            
                            if (!snap.exists) {
                                await docRef.set({
                                    date: dateObj.toISOString(),
                                    description: description,
                                    amount: amount,
                                    reconciled: false,
                                    projectId: '',
                                    category: category,
                                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                                });
                                importCount++;
                            }
                        }
                    }
                    event.target.value = '';
                    showAlert("Import Successful", `Successfully imported ${importCount} new transactions. Duplicates were skipped.`);
                } catch (err) {
                    console.error("Import Error", err);
                    showAlert("Import Failed", "An error occurred while importing transactions.");
                }
            }
        });
    };

    const openTransactionModal = (project, transactionType) => {
        setInputValue('');
        setModalConfig({ isOpen: true, type: 'transaction', data: { project, transactionType } });
    };

    const openAddProjectModal = (categoryType) => {
        setInputName(''); setInputValue('0'); setInputTarget('0');
        setModalConfig({ isOpen: true, type: 'addProject', data: { categoryType } });
    };

    const openEditProjectModal = (project) => {
        setInputName(project.name); setInputValue(project.balance.toString()); setInputTarget(project.target ? project.target.toString() : '0');
        setModalConfig({ isOpen: true, type: 'editProject', data: { project } });
    };

    const openEditTotalCashModal = () => {
        setInputValue(totalCash.toString());
        setModalConfig({ isOpen: true, type: 'editTotalCash', data: null });
    };

    const closeModal = () => {
        setModalConfig({ ...modalConfig, isOpen: false });
        setInputValue(''); setInputName(''); setInputTarget('');
        setEditTxData({ id: '', date: '', description: '', amount: '', category: '', projectId: '' });
    };

    const handleModalSubmit = async (e) => {
        e.preventDefault();
        const { type, data } = modalConfig;

        if (type === 'transaction') {
            const amount = parseFloat(inputValue);
            if (isNaN(amount) || amount <= 0) return showAlert("Invalid Input", "Please enter a valid amount greater than 0.");

            if (data.transactionType === 'general_income') {
                await dbUpdateTotalCash(totalCash + amount);
            } else {
                const isExpense = data.transactionType === 'spend';
                const change = isExpense ? -amount : amount;
                await dbUpdateProjectBalance(data.project.id, data.project.balance, change);
            }
        } else if (type === 'addProject') {
            if (!inputName.trim()) return showAlert("Invalid Input", "Please enter a project name.");
            await dbAddProject({
                name: inputName, balance: parseFloat(inputValue) || 0, type: data.categoryType,
                icon: data.categoryType === 'special' ? 'star' : 'briefcase', target: parseFloat(inputTarget) || 0
            });
        } else if (type === 'editProject') {
            if (!inputName.trim()) return showAlert("Invalid Input", "Please enter a project name.");
            const newBalance = parseFloat(inputValue);
            if (isNaN(newBalance)) return showAlert("Invalid Input", "Please enter a valid balance.");
            
            await dbUpdateProjectDetails(
                data.project.id, { name: inputName, balance: newBalance, target: parseFloat(inputTarget) || 0 },
                newBalance, data.project.balance
            );
        } else if (type === 'editTotalCash') {
             const amount = parseFloat(inputValue);
             if (isNaN(amount) || amount < 0) return showAlert("Invalid Input", "Please enter a valid non-negative amount.");
             await dbUpdateTotalCash(amount);
        } else if (type === 'editTransaction') {
             const amt = parseFloat(editTxData.amount);
             if (isNaN(amt) || amt === 0) return showAlert("Invalid Input", "Please enter a valid non-zero amount.");
             if (!editTxData.description.trim()) return showAlert("Invalid Input", "Please enter a description.");
             if (!editTxData.date) return showAlert("Invalid Input", "Please select a date.");

             const txRef = db.collection('artifacts').doc(appId).collection('public').doc('data').collection('transactions').doc(editTxData.id);
             
             // appending T12:00:00 protects the date from timezone shifting across midnight
             const updatedDate = new Date(editTxData.date + 'T12:00:00').toISOString();

             await txRef.update({
                 date: updatedDate,
                 description: editTxData.description.trim(),
                 amount: amt,
                 category: editTxData.category.trim() || 'Uncategorized',
                 projectId: editTxData.projectId
             });
        } else if (type === 'addTransaction') {
             // Logic for adding a completely new manual transaction row
             const amt = parseFloat(editTxData.amount);
             if (isNaN(amt) || amt === 0) return showAlert("Invalid Input", "Please enter a valid non-zero amount.");
             if (!editTxData.description.trim()) return showAlert("Invalid Input", "Please enter a description.");
             if (!editTxData.date) return showAlert("Invalid Input", "Please select a date.");

             const updatedDate = new Date(editTxData.date + 'T12:00:00').toISOString();

             await db.collection('artifacts').doc(appId).collection('public').doc('data').collection('transactions').doc(editTxData.id).set({
                 date: updatedDate,
                 description: editTxData.description.trim(),
                 amount: amt,
                 category: editTxData.category.trim() || 'Manual Entry',
                 projectId: editTxData.projectId,
                 reconciled: false,
                 createdAt: firebase.firestore.FieldValue.serverTimestamp()
             });
        }
        closeModal();
    };

    const specialProjects = projects.filter(p => p.type === 'special');
    const generalProjects = projects.filter(p => p.type === 'general');
    const totalAllocated = specialProjects.reduce((sum, p) => sum + (parseFloat(p.balance) || 0), 0);
    const totalUnrestricted = totalCash - totalAllocated;

    // Dynamically generate the list of available years from the transaction data
    const availableYears = useMemo(() => {
        const years = transactions.map(t => {
            if (!t.date) return null;
            return new Date(t.date).getFullYear().toString();
        }).filter(Boolean);
        
        return ['All', ...new Set(years)].sort((a, b) => b === 'All' ? 1 : a === 'All' ? -1 : b - a);
    }, [transactions]);

    const visibleTransactions = useMemo(() => {
        return transactions.filter(tx => {
            // Apply Year Filter
            if (filterYear !== 'All') {
                const txYear = tx.date ? new Date(tx.date).getFullYear().toString() : null;
                if (txYear !== filterYear) return false;
            }

            // Apply Reconciliation Filter
            if (isReconMode) {
                const txDate = new Date(tx.date);
                if (statementStartDate) {
                    const startDate = new Date(statementStartDate + 'T00:00:00');
                    if (txDate < startDate) return false;
                }
                if (statementEndDate) {
                    const endDate = new Date(statementEndDate + 'T23:59:59'); 
                    if (txDate > endDate) return false;
                }
            }
            return true;
        });
    }, [transactions, isReconMode, statementStartDate, statementEndDate, filterYear]);

    const reconciledSum = visibleTransactions
        .filter(tx => tx.reconciled)
        .reduce((sum, tx) => sum + (parseFloat(tx.amount) || 0), 0);
        
    const clearedBalance = (parseFloat(startingBalance) || 0) + reconciledSum;
    const reconDifference = (parseFloat(statementBalance) || 0) - clearedBalance;

    if (loading) return (
        <div className="min-h-screen bg-green-950 flex items-center justify-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
        </div>
    );

    if (!user) return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full text-center border-t-4 border-green-800">
                <img src="https://itechcharities.org/wp-content/uploads/2023/06/idc-logo.png" alt="ITech Logo" className="h-16 mx-auto mb-6 object-contain" onError={(e) => e.target.style.display='none'} />
                <h2 className="text-2xl font-bold text-green-900 mb-2">Restricted Funds Ledger</h2>
                <p className="text-gray-500 mb-8 text-sm">Please sign in with your corporate account to access financial data and bank reconciliations.</p>
                {errorMsg && <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-6 text-left border border-red-200">{errorMsg}</div>}
                <button onClick={handleLogin} className="w-full flex items-center justify-center space-x-3 bg-[#051614] hover:bg-black text-white px-4 py-3 rounded-lg transition-all shadow-md font-medium">
                    <Icons.Microsoft /> <span>Sign in with Microsoft</span>
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <header className="bg-[#0f3d23] text-white shadow-md border-b-4 border-yellow-500 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="hidden sm:block h-12 w-12 bg-white rounded-lg p-1 flex items-center justify-center">
                            <img src="idc-logo.png" alt="ITech Logo" className="h-full w-full object-contain" onError={(e) => { e.target.onerror = null; e.target.src = 'https://itechcharities.org/wp-content/uploads/2023/06/idc-logo.png'; }} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-white">ITech Financial Ledger</h1>
                            <div className="flex space-x-4 mt-1">
                                <button 
                                    onClick={() => setActiveTab('dashboard')} 
                                    className={`text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'text-yellow-400 border-b border-yellow-400 pb-1' : 'text-green-200 hover:text-white'}`}
                                >
                                    Dashboard
                                </button>
                                <button 
                                    onClick={() => setActiveTab('transactions')} 
                                    className={`text-sm font-medium transition-colors ${activeTab === 'transactions' ? 'text-yellow-400 border-b border-yellow-400 pb-1' : 'text-green-200 hover:text-white'}`}
                                >
                                    Reconciliation
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button type="button" onClick={handlePrintReport} className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-400 text-green-900 px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm">
                            <Icons.Printer /> <span className="hidden sm:inline">Print Report</span>
                        </button>
                        <div className="text-right hidden sm:block border-l border-green-700/50 pl-4">
                            <p className="text-xs text-green-200 uppercase tracking-wide">Logged In</p>
                            <div className="flex items-center space-x-2">
                                <p className="font-medium text-sm">{user.displayName || user.email || 'Admin'}</p>
                                <button onClick={handleLogout} className="text-xs text-red-300 hover:text-white underline">Logout</button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {dbError && (
                <div className="bg-red-600 text-white px-4 py-2 text-center text-sm font-bold shadow-inner">
                    ⚠️ {dbError}
                </div>
            )}

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'dashboard' && (
                    <div className="animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center space-x-2">
                                            <p className="text-sm font-medium text-gray-500 uppercase">Total Cash on Hand</p>
                                            <button onClick={openEditTotalCashModal} className="text-gray-400 hover:text-green-600 transition-colors bg-gray-100 p-1 rounded">
                                                <Icons.Pencil />
                                            </button>
                                        </div>
                                        <h2 className="text-3xl font-bold text-gray-900 mt-2">${totalCash.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
                                    </div>
                                    <div className="p-3 bg-blue-50 rounded-xl text-blue-600"><Icons.Wallet /></div>
                                </div>
                            </div>
                            
                            <div className="bg-gradient-to-br from-[#0f3d23] to-[#0a2a18] rounded-xl shadow-sm p-6 text-white border border-[#0f3d23]">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-medium text-green-200 uppercase">Restricted Funds (Special)</p>
                                        <h2 className="text-3xl font-bold text-yellow-400 mt-2">${totalAllocated.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
                                    </div>
                                    <div className="p-3 bg-green-800/50 rounded-xl text-yellow-400"><Icons.Lock /></div>
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 uppercase">Unrestricted Operating</p>
                                        <h2 className={`text-3xl font-bold mt-2 ${totalUnrestricted < 0 ? 'text-red-600' : 'text-gray-900'}`}>${totalUnrestricted.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
                                    </div>
                                    <div className="p-3 bg-gray-100 rounded-xl text-gray-600"><Icons.Unlock /></div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                                    <h3 className="text-lg font-bold text-gray-900">Restricted Funds</h3>
                                    <button onClick={() => openAddProjectModal('special')} className="text-sm bg-green-50 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-100 font-medium transition-colors border border-green-200">+ Add Fund</button>
                                </div>
                                {specialProjects.length === 0 && <div className="text-center p-8 bg-white rounded-xl border border-dashed border-gray-300 text-gray-500 text-sm">No restricted funds created yet.</div>}
                                {specialProjects.map(project => <ProjectCard key={project.id} project={project} onTransact={openTransactionModal} onEdit={openEditProjectModal} onDelete={(id) => showConfirm('Delete Fund', 'Are you sure you want to delete this restricted fund?', () => dbDeleteProject(id))} theme="dark" />)}
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                                    <h3 className="text-lg font-bold text-gray-900">General Allocations</h3>
                                    <button onClick={() => openAddProjectModal('general')} className="text-sm bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50 font-medium transition-colors">+ Add Category</button>
                                </div>
                                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-gray-100 rounded-lg text-gray-600"><Icons.Wallet /></div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">Unallocated Cash</h4>
                                                <p className="text-xs text-gray-500">General operating surplus</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-end mt-4">
                                        <div className="text-2xl font-bold text-gray-900">${totalUnrestricted.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                                        <button onClick={() => openTransactionModal(null, 'general_income')} className="bg-gray-900 hover:bg-black text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center transition-colors">
                                            <div className="mr-1 h-4 w-4"><Icons.Plus /></div> Add Income
                                        </button>
                                    </div>
                                </div>
                                {generalProjects.map(project => <ProjectCard key={project.id} project={project} onTransact={openTransactionModal} onEdit={openEditProjectModal} onDelete={(id) => showConfirm('Delete Category', 'Are you sure you want to delete this category?', () => dbDeleteProject(id))} theme="light" />)}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'transactions' && (
                    <div className="animate-fade-in max-w-5xl mx-auto">
                        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Transactions Ledger</h2>
                                <p className="text-sm text-gray-500 mt-1">Import bank statements and categorize to specific funds.</p>
                            </div>
                            <div className="flex space-x-3">
                                <button 
                                    onClick={() => showConfirm('Clear Ledger', 'Are you sure you want to permanently delete ALL imported transactions? This cannot be undone.', deleteAllTransactions)} 
                                    className="bg-white text-red-600 hover:bg-red-50 border border-red-200 px-4 py-2 rounded-lg shadow-sm font-medium text-sm transition-colors flex items-center space-x-2"
                                >
                                    <Icons.Trash2 /> <span className="hidden sm:inline">Delete All</span>
                                </button>
                                <button 
                                    onClick={handleAutoCategorize} 
                                    disabled={isCategorizing}
                                    className={`bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 px-4 py-2 rounded-lg shadow-sm font-medium text-sm transition-colors flex items-center space-x-2 ${isCategorizing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {isCategorizing ? (
                                        <div className="animate-spin h-4 w-4 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
                                    ) : (
                                        <Icons.Sparkles />
                                    )}
                                    <span className="hidden sm:inline">{isCategorizing ? 'Analyzing...' : 'Auto-Categorize'}</span>
                                </button>
                                <label className="cursor-pointer flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm font-medium text-sm">
                                    <Icons.Upload /> <span>Import Bank CSV</span>
                                    <input type="file" accept=".csv" className="hidden" onChange={handleCSVImport} />
                                </label>
                                <button onClick={handleAddTransaction} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm font-medium text-sm transition-colors flex items-center space-x-2">
                                    <span>Add Transaction</span> <Icons.Plus />
                                </button>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                            <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
                                
                                {/* YEAR FILTER AND ACCOUNT SELECTOR */}
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <Icons.Filter />
                                        <select className="bg-transparent border-none text-sm font-medium text-gray-700 focus:ring-0 cursor-pointer">
                                            <option>All Accounts (Bank)</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center space-x-2 border-l border-gray-300 pl-4">
                                        <span className="text-sm font-medium text-gray-500">Year:</span>
                                        <select 
                                            value={filterYear} 
                                            onChange={(e) => setFilterYear(e.target.value)}
                                            className="bg-white border border-gray-300 text-sm font-medium text-gray-700 rounded-md py-1 px-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                                        >
                                            {availableYears.map(year => (
                                                <option key={year} value={year}>{year === 'All' ? 'All Years' : year}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-3 border-r border-gray-300 pr-4">
                                        <Icons.LayoutDashboard />
                                        <span className="text-sm font-medium text-gray-700">Reconciliation</span>
                                        <button 
                                            onClick={() => setIsReconMode(!isReconMode)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isReconMode ? 'bg-blue-600' : 'bg-gray-300'}`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${isReconMode ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                        <Icons.CheckCircle />
                                        <span>{visibleTransactions.filter(t => t.reconciled).length} Reconciled</span>
                                    </div>
                                </div>
                            </div>
                            
                            {isReconMode && (
                                <div className="bg-blue-50 border-b border-blue-100 p-4 flex flex-col sm:flex-row justify-between items-center animate-fade-in shadow-inner gap-4">
                                    <div className="flex-1 w-full">
                                        <p className="text-sm text-blue-800 font-medium mb-1">Starting Balance</p>
                                        <div className="flex items-center bg-white border border-blue-200 rounded overflow-hidden shadow-sm">
                                            <span className="text-blue-900 font-bold px-3 py-2 bg-gray-50 border-r border-blue-200">$</span>
                                            <input 
                                                type="number" 
                                                value={startingBalance} 
                                                onChange={(e) => setStartingBalance(e.target.value)}
                                                className="px-3 py-2 text-sm w-full focus:outline-none focus:ring-0 text-blue-900 font-semibold" 
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1 w-full">
                                        <p className="text-sm text-blue-800 font-medium mb-1">Statement Start Date</p>
                                        <input 
                                            type="date" 
                                            value={statementStartDate} 
                                            onChange={(e) => setStatementStartDate(e.target.value)}
                                            className="px-3 py-2 w-full text-sm focus:outline-none focus:ring-0 text-blue-900 font-semibold border border-blue-200 rounded shadow-sm bg-white" 
                                        />
                                    </div>
                                    <div className="flex-1 w-full">
                                        <p className="text-sm text-blue-800 font-medium mb-1">Statement End Date</p>
                                        <input 
                                            type="date" 
                                            value={statementEndDate} 
                                            onChange={(e) => setStatementEndDate(e.target.value)}
                                            className="px-3 py-2 w-full text-sm focus:outline-none focus:ring-0 text-blue-900 font-semibold border border-blue-200 rounded shadow-sm bg-white" 
                                        />
                                    </div>
                                    <div className="flex-1 w-full">
                                        <p className="text-sm text-blue-800 font-medium mb-1">Closing Balance</p>
                                        <div className="flex items-center bg-white border border-blue-200 rounded overflow-hidden shadow-sm">
                                            <span className="text-blue-900 font-bold px-3 py-2 bg-gray-50 border-r border-blue-200">$</span>
                                            <input 
                                                type="number" 
                                                value={statementBalance} 
                                                onChange={(e) => setStatementBalance(e.target.value)}
                                                className="px-3 py-2 text-sm w-full focus:outline-none focus:ring-0 text-blue-900 font-semibold" 
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1 w-full text-center sm:text-right">
                                        <p className="text-sm text-blue-800 font-medium mb-1">Cleared Balance</p>
                                        <p className="text-2xl font-bold text-blue-900">${clearedBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                                    </div>
                                    <div className="flex-1 w-full text-right">
                                        <p className="text-sm text-blue-800 font-medium mb-1">Difference</p>
                                        <div className={`flex items-center justify-end text-2xl font-bold ${reconDifference === 0 && statementBalance !== '' ? 'text-green-600' : (statementBalance !== '' ? 'text-red-600' : 'text-gray-900')}`}>
                                            <span>${Math.abs(reconDifference).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                            {reconDifference === 0 && statementBalance !== '' && <span className="ml-2 bg-green-100 text-green-600 rounded-full p-1"><Icons.Check /></span>}
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse whitespace-nowrap">
                                    <thead>
                                        <tr className="bg-white border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                                            <th className="p-4 w-32">Date</th>
                                            <th className="p-4 max-w-xs">Description</th>
                                            <th className="p-4 w-48">Fund Tracking</th>
                                            <th className="p-4 w-32 text-right">Amount</th>
                                            <th className="p-4 w-24 text-center">Reconciled</th>
                                            <th className="p-4 w-24 text-center"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {visibleTransactions.length === 0 && (
                                            <tr>
                                                <td colSpan="6" className="p-12 text-center text-gray-500">
                                                    <div className="flex justify-center mb-3"><Icons.List className="text-gray-300 h-10 w-10" /></div>
                                                    <p>No transactions found.</p>
                                                    <p className="text-sm mt-1">Import a CSV or change the statement date/year filter.</p>
                                                </td>
                                            </tr>
                                        )}
                                        {visibleTransactions.map(tx => (
                                            <tr key={tx.id} className={`hover:bg-gray-50 transition-colors ${tx.reconciled ? 'bg-green-50/30' : ''}`}>
                                                <td className="p-4 text-sm text-gray-600">
                                                    {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </td>
                                                <td className="p-4 max-w-xs truncate">
                                                    <div className="text-sm font-medium text-gray-900 truncate" title={tx.description}>{tx.description}</div>
                                                    {tx.category && tx.category !== 'Uncategorized' && (
                                                        <div className="text-xs text-gray-500 font-medium mt-0.5 truncate bg-gray-100 inline-block px-1.5 py-0.5 rounded" title={tx.category}>
                                                            {tx.category}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    <select 
                                                        value={tx.projectId || ''} 
                                                        onChange={(e) => updateTransactionFund(tx.id, e.target.value)}
                                                        disabled={tx.applied}
                                                        className={`w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 py-1.5 px-2 cursor-pointer ${tx.applied ? 'opacity-50 cursor-not-allowed ' : ''}${tx.projectId ? 'bg-blue-50 text-blue-800 border-blue-200 font-medium' : 'bg-gray-50 text-gray-500'}`}
                                                    >
                                                        <option value="">Uncategorized</option>
                                                        <optgroup label="Restricted Funds">
                                                            {specialProjects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                                        </optgroup>
                                                        <optgroup label="General Categories">
                                                            {generalProjects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                                        </optgroup>
                                                    </select>
                                                </td>
                                                <td className={`p-4 text-right text-sm font-bold ${tx.amount < 0 ? 'text-gray-900' : 'text-green-600'}`}>
                                                    {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                                </td>
                                                <td className="p-4 text-center">
                                                    <button 
                                                        onClick={() => toggleReconciliation(tx)}
                                                        className={`p-1 rounded-full border transition-all ${tx.reconciled ? 'text-white bg-blue-600 border-blue-600 hover:bg-blue-700' : 'text-gray-300 border-gray-300 hover:border-gray-500 hover:text-gray-500'}`}
                                                        title={tx.applied ? "Un-reconcile and Reverse Balance" : "Reconcile and Apply Balance"}
                                                    >
                                                        <Icons.Check />
                                                    </button>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <div className="flex justify-center space-x-1">
                                                        <button onClick={() => openEditTransactionModal(tx)} className="text-gray-400 hover:text-blue-500 transition-colors p-1.5 rounded-lg hover:bg-gray-100" title="Edit Transaction">
                                                            <Icons.Pencil />
                                                        </button>
                                                        <button onClick={() => showConfirm('Delete Transaction', 'Are you sure you want to remove this transaction from the ledger?', () => deleteTransaction(tx.id))} className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-gray-100" title="Delete Transaction">
                                                            <Icons.Trash2 />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Modal isOpen={modalConfig.isOpen} onClose={closeModal} title={modalConfig.type === 'transaction' ? (modalConfig.data?.transactionType === 'add' ? 'Add Donation' : modalConfig.data?.transactionType === 'spend' ? 'Log Expense' : 'Add General Income') : modalConfig.type === 'addProject' ? 'Create New Fund' : modalConfig.type === 'editProject' ? 'Edit Fund' : modalConfig.type === 'editTransaction' ? 'Edit Transaction' : modalConfig.type === 'addTransaction' ? 'Add Manual Transaction' : 'Update Total Cash'}>
                <form onSubmit={handleModalSubmit} className="space-y-4">
                    {(modalConfig.type === 'addProject' || modalConfig.type === 'editProject') && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fund / Category Name</label>
                            <input type="text" autoFocus value={inputName} onChange={(e) => setInputName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g., Youth Scholarship" />
                        </div>
                    )}

                    {(modalConfig.type === 'editTransaction' || modalConfig.type === 'addTransaction') && (
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                <input type="date" value={editTxData.date} onChange={(e) => setEditTxData({...editTxData, date: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <input type="text" value={editTxData.description} onChange={(e) => setEditTxData({...editTxData, description: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><span className="text-gray-500 sm:text-sm">$</span></div>
                                    <input type="number" step="0.01" value={editTxData.amount} onChange={(e) => setEditTxData({...editTxData, amount: e.target.value})} className="w-full pl-7 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bank Category</label>
                                <input type="text" value={editTxData.category} onChange={(e) => setEditTxData({...editTxData, category: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Restricted Fund Tracking</label>
                                <select value={editTxData.projectId} onChange={(e) => setEditTxData({...editTxData, projectId: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="">Uncategorized</option>
                                    <optgroup label="Restricted Funds">
                                        {specialProjects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </optgroup>
                                    <optgroup label="General Categories">
                                        {generalProjects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </optgroup>
                                </select>
                            </div>
                        </div>
                    )}
                    
                    {(modalConfig.type !== 'editTransaction' && modalConfig.type !== 'addTransaction') && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {modalConfig.type === 'addProject' ? 'Initial Balance' : modalConfig.type === 'editProject' ? 'Current Balance' : modalConfig.type === 'editTotalCash' ? 'New Bank Balance' : 'Amount'}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><span className="text-gray-500 sm:text-sm">$</span></div>
                                <input type="number" step="0.01" autoFocus={modalConfig.type === 'transaction' || modalConfig.type === 'editTotalCash'} value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="w-full pl-7 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="0.00" />
                            </div>
                        </div>
                    )}

                    {(modalConfig.type === 'addProject' || modalConfig.type === 'editProject') && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Target Goal (Optional)</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><span className="text-gray-500 sm:text-sm">$</span></div>
                                <input type="number" step="0.01" value={inputTarget} onChange={(e) => setInputTarget(e.target.value)} className="w-full pl-7 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="0.00" />
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100">
                        <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-green-700 hover:bg-green-800 rounded-lg transition-colors">Save Details</button>
                    </div>
                </form>
            </Modal>

            <MessageBox config={msgBox} onClose={() => setMsgBox(prev => ({...prev, isOpen: false}))} />
        </div>
    );
}

function ProjectCard({ project, onTransact, onEdit, onDelete, theme }) {
    const isDark = theme === 'dark';
    return (
        <div className={`rounded-xl border p-5 relative transition-all hover:shadow-md ${isDark ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${isDark ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {project.icon === 'sun' && <Icons.Sun />}
                        {project.icon === 'store' && <Icons.Store />}
                        {project.icon === 'star' && <Icons.LayoutDashboard />}
                        {project.icon === 'briefcase' && <Icons.Wallet />}
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900">{project.name}</h4>
                        <p className="text-xs text-gray-500">{project.type === 'special' ? 'Restricted Fund' : 'General Category'}</p>
                    </div>
                </div>
                <div className="flex space-x-1">
                    <button type="button" onClick={() => onEdit(project)} className="text-gray-400 hover:text-blue-600 p-1.5 rounded-lg hover:bg-white transition-colors"><Icons.Pencil /></button>
                    <button type="button" onClick={() => onDelete(project.id)} className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-white transition-colors"><Icons.Trash2 /></button>
                </div>
            </div>
            <div className="mb-5">
                <div className="flex justify-between items-end mb-1">
                    <div className="text-2xl font-bold text-gray-900">${(project.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                    {project.target > 0 && <div className="text-xs text-gray-500 font-medium">Target: ${project.target.toLocaleString()}</div>}
                </div>
                {project.target > 0 && <div className="w-full h-1.5 rounded-full mt-2 bg-gray-200"><div className={`h-full rounded-full ${isDark ? 'bg-green-600' : 'bg-blue-500'}`} style={{ width: `${Math.min(((project.balance || 0) / project.target) * 100, 100)}%` }}></div></div>}
            </div>
            <div className="flex space-x-3">
                <button type="button" onClick={() => onTransact(project, 'add')} className="flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center space-x-2 transition-colors bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"><Icons.TrendingUp /><span>Add</span></button>
                <button type="button" onClick={() => onTransact(project, 'spend')} className="flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center space-x-2 transition-colors bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"><Icons.TrendingDown /><span>Spend</span></button>
            </div>
        </div>
    );
}