// Firestore REST API でテストデータを投入するスクリプト
// 使い方: node scripts/seed.mjs

const PROJECT_ID = 'yt-task-manager-6b332';
const API_KEY = 'AIzaSyB8MssVzFsP3MYsmCjFefKbascGffQTD6s';
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

const now = new Date().toISOString();

// ---------- helpers ----------

async function addDoc(collection, fields) {
  const res = await fetch(`${BASE}/${collection}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields }),
  });
  if (!res.ok) throw new Error(`POST ${collection} failed: ${await res.text()}`);
  const data = await res.json();
  // name は "projects/.../documents/col/docId" 形式
  const id = data.name.split('/').pop();
  console.log(`  ✓ ${collection}/${id}`);
  return id;
}

function str(v)  { return { stringValue: v }; }
function ts(v)   { return { timestampValue: v }; }

// ---------- Workers ----------

console.log('\n== Workers ==');
const workers = [
  { name: '田中 太郎', email: 'tanaka@example.com' },
  { name: '佐藤 花子', email: 'sato@example.com' },
  { name: '鈴木 一郎', email: 'suzuki@example.com' },
  { name: '高橋 みか', email: 'takahashi@example.com' },
];

const workerIds = [];
for (const w of workers) {
  const id = await addDoc('workers', {
    name: str(w.name),
    email: str(w.email),
    createdAt: ts(now),
  });
  workerIds.push({ id, name: w.name });
}

// ---------- Videos ----------

console.log('\n== Videos ==');
const videos = [
  { title: 'EP021 パパママ1人がたりバージョン', description: 'あらたな挑戦', youtubeUrl: '' },
  { title: 'EP022 初心者向けAI活用術',          description: 'AI入門シリーズ第1弾', youtubeUrl: '' },
  { title: 'EP023 Mac効率化ツール比較',          description: '生産性向上シリーズ', youtubeUrl: '' },
];

const videoIds = [];
for (const v of videos) {
  const id = await addDoc('videos', {
    title:       str(v.title),
    description: str(v.description),
    youtubeUrl:  str(v.youtubeUrl),
    status:      str('pre_production'),
    createdAt:   ts(now),
    updatedAt:   ts(now),
  });
  videoIds.push(id);
}

// ---------- Tasks ----------

console.log('\n== Tasks ==');

// タスク種別ごとに担当ワーカーを割り振る
const taskDefs = [
  { type: 'thumbnail',   workerIdx: 0 },
  { type: 'recording',   workerIdx: 1 },
  { type: 'cut',         workerIdx: 1 },
  { type: 'telop',       workerIdx: 2 },
  { type: 'expression',  workerIdx: 2 },
  { type: 'se',          workerIdx: 3 },
  { type: 'finishing',   workerIdx: 1 },
  { type: 'upload',      workerIdx: 0 },
];

const TYPE_LABELS = {
  thumbnail:   'サムネ作成',
  recording:   '動画撮影(音声)',
  cut:         'カット',
  telop:       'テロップ',
  ppt_create:  'パワポ資料作成',
  ppt_attach:  'パワポ資料つけ',
  expression:  '表情つけ',
  se:          'SEつけ',
  illustration:'イラストつけ',
  finishing:   '仕上げ',
  short:       'ショート作成',
  upload:      'アップロード',
};

// 動画ごとにタスクを追加（各動画でステータスを少しずつ変えてリアルに見せる）
const statusPatterns = [
  // EP021: 撮影済み・編集中
  ['done', 'done', 'in_progress', 'todo', 'todo', 'todo', 'todo', 'todo'],
  // EP022: まだ始まったばかり
  ['in_progress', 'needs_request', 'todo', 'todo', 'todo', 'todo', 'todo', 'todo'],
  // EP023: 企画段階
  ['todo', 'todo', 'todo', 'todo', 'todo', 'todo', 'todo', 'todo'],
];

for (let vi = 0; vi < videoIds.length; vi++) {
  const videoId = videoIds[vi];
  const videoTitle = videos[vi].title;
  for (let ti = 0; ti < taskDefs.length; ti++) {
    const def = taskDefs[ti];
    const worker = workerIds[def.workerIdx];
    const status = statusPatterns[vi][ti];
    await addDoc('tasks', {
      videoId:             str(videoId),
      type:                str(def.type),
      label:               str(`${videoTitle} / ${TYPE_LABELS[def.type]}`),
      assignedWorkerId:    str(worker.id),
      assignedWorkerName:  str(worker.name),
      status:              str(status),
      notes:               str(''),
      createdAt:           ts(now),
      updatedAt:           ts(now),
    });
  }
}

console.log('\n✅ シード完了！');
