const DB_KEY = "cbse_paper_history";

function getHistoryData() {
    try {
        return JSON.parse(localStorage.getItem(DB_KEY)) || [];
    } catch {
        console.warn("History corrupted, resetting.");
        localStorage.removeItem(DB_KEY);
        return [];
    }
}

function saveHistoryData(historyArray) {
    localStorage.setItem(DB_KEY, JSON.stringify(historyArray));
}

function addPaperToHistory(paperData, criteria) {
    let history = getHistoryData();

    const record = {
        id: Date.now(),
        date: new Date().toISOString(),
        criteria,
        questions: paperData.map(q => q.id),
        starred: false
    };

    // Add newest first
    history.unshift(record);

    // --- Trim logic ---
    // Rule: preserve all starred, but enforce max 10 non-starred
    const starred = history.filter(r => r.starred);
    const nonStarred = history.filter(r => !r.starred);

    if (nonStarred.length > 10) {
        nonStarred.splice(10); // keep only first 10
    }

    history = [...starred, ...nonStarred];

    saveHistoryData(history);
}
