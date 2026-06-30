const { autoQuery } = require("./core");
const {
  QApplication, QMainWindow, QWidget, QLineEdit, QLabel,
  QFont, Qt, QVBoxLayout, QPalette, QColor, QKeySequence
} = require("@nodegui/nodegui");

const app = new QApplication([]);
const win = new QMainWindow();
win.setWindowTitle("詞典精靈 DictSprite");
win.setFixedSize(540, 700);

const darkPal = new QPalette();
darkPal.setColor(QPalette.Window, new QColor(14, 16, 23));
darkPal.setColor(QPalette.WindowText, new QColor(240, 240, 240));
darkPal.setColor(QPalette.Base, new QColor(30,34,48));
app.setPalette(darkPal);

const central = new QWidget();
const layout = new QVBoxLayout();
layout.setContentsMargins(18,18,18,18);
layout.setSpacing(12);

const fontNormal = new QFont("Microsoft YaHei", 11);
const fontInput = new QFont("Microsoft YaHei", 15);

const edit = new QLineEdit();
edit.setPlaceholderText("輸入簡體 / 繁體 / 英文，自動互查");
edit.setFont(fontInput);
edit.setFixedHeight(48);

const tipLabel = new QLabel("規則：輸入任一文字，自動生成另外兩種寫法，全程離線，不上傳任何數據");
tipLabel.setWordWrap(true);
tipLabel.setStyleSheet("color:#aaaaaa;");
tipLabel.setFont(fontNormal);

const resultLabel = new QLabel("");
resultLabel.setWordWrap(true);
resultLabel.setFont(fontNormal);
resultLabel.setStyleSheet("padding:14px;border-radius:12px;background:rgba(255,255,255,0.06);");

edit.textChanged.connect((text)=>{
  const res = autoQuery(text);
  if(res.type === "none"){
    resultLabel.setText("暫未收錄該詞條");
    return;
  }
  const htmlText = `
<div style="color:#63b8ff;font-size:16px;margin-bottom:8px;">輸入類型：${res.type}</div>
<div style="color:#ffffff;font-size:18px;">簡體中文：${res.simp}</div>
<div style="color:#ffd370;font-size:18px;">繁體中文：${res.trad}</div>
<div style="color:#89e089;">拼音：${res.pinyin}</div>
<div style="color:#dddddd;font-size:14px;line-height:1.7;">英文釋義：${res.explain}</div>
  `;
  resultLabel.setText(htmlText);
});

win.addShortcut(QKeySequence.fromString("Esc"));
app.shortcutActivated.connect(()=>{
  win.close();
});

layout.addWidget(edit);
layout.addWidget(tipLabel);
layout.addWidget(resultLabel);
central.setLayout(layout);
win.setCentralWidget(central);

win.show();
app.exec();
