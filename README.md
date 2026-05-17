# AetherMotion Lab

## 🇺🇸 English

AetherMotion is an AI-powered, next-generation vector motion graphics creation platform.

### What is AetherMotion?
It is a high-tech laboratory that combines Genkit AI and GSAP (GreenSock Animation Platform) to generate animations from text. This system combines human creativity with the speed of AI to take web-based animation to a new level.

### What can AetherMotion do?
- **Text-to-Motion**: Simply enter your desired description as a prompt, and the system automatically generates multi-layered SVG images and professional-grade GSAP code to bring them to life.
- **Real-time Control**: Play back generated animations on the "Motion Stage," analyze code using the "Live Inspector," and refine as needed.
- **Professional Export**: Download generated animations as standalone HTML files or static SVGs for direct use in your websites or applications.
- **User Management**: Create a profile using Firebase, save your generation history, and manage your subscription plans (Free/Pro).

### Who is AetherMotion for?
This platform is designed for web designers, front-end developers, and creative engineers. It aims to shorten hours of complex vector animation work into seconds, helping create live, modern, "cinematic" quality motion graphics for websites.

---

## 🇯🇵 日本語 (Japanese)

AetherMotionは、AIを活用した次世代のベクトルモーショングラフィックス作成プラットフォームです。

### AetherMotionとは？
Genkit AIとGSAP（GreenSock Animation Platform）を組み合わせ、テキストからアニメーションを生成するハイテク・ラボラトリーです。このシステムは、人間の創造性とAIのスピードを融合させ、ウェブベースのアニメーションを新たな次元へと引き上げます。

### AetherMotionでできること
- **テキストからモーション生成**: プロンプトとして希望の表現を入力するだけで、システムが自動的に多層SVG画像と、それを動かすプロフェッショナル級のGSAPコードを生成します。
- **リアルタイム・コントロール**: 生成されたアニメーションを「Motion Stage」ですぐに再生し、「Live Inspector」でコードを分析、必要に応じて調整できます。
- **プロフェッショナル・エクスポート**: 生成したアニメーションをスタンドアロンHTMLファイルまたは静的SVGとしてダウンロードし、ウェブサイトやアプリケーションで直接使用できます。
- **ユーザー管理**: Firebaseを使用してプロファイルを作成し、生成履歴を保存、サブスクリプションプラン（Free/Pro）を管理できます。

### AetherMotionは誰のためのものですか？
このプラットフォームは、ウェブデザイナー、フロントエンド開発者、クリエイティブエンジニア向けに設計されています。複雑なベクトルアニメーションにかかる時間を数秒に短縮し、ウェブサイトに生き生きとした、モダンで「シネマティック」な品質のモーショングラフィックスを作成することを目的としています。

---

## 🇲🇳 Монгол (Mongolian)

AetherMotion бол хиймэл оюун ухаанд суурилсан, дараагийн үеийн вектор хөдөлгөөнт график бүтээх платформ юм.

### AetherMotion гэж юу вэ?
Энэ нь Genkit AI болон GSAP (GreenSock Animation Platform) технологийг хослуулсан, текстээс хөдөлгөөнт дүрс үүсгэдэг өндөр технологийн лаборатори юм. Энэхүү систем нь хүний бүтээлч сэтгэлгээг хиймэл оюун ухааны хурдтай нэгтгэж, вэб технологид суурилсан анимацийг шинэ түвшинд гаргадаг.

### AetherMotion юу хийж чадах вэ?
- **Текстээс хөдөлгөөн үүсгэх**: Та зөвхөн хүссэн дүрслэлээ бичвэрээр (prompt) оруулахад систем автоматаар олон давхаргат SVG дүрс болон түүнийг амилуулах мэргэжлийн түвшний GSAP кодыг үүсгэж чадна.
- **Бодит цагийн хяналт**: Үүсгэсэн анимациа "Motion Stage" дээр шууд тоглуулж үзэх, кодыг нь "Live Inspector" ашиглан шинжлэх, шаардлагатай бол дахин засварлах боломжтой.
- **Мэргэжлийн экспорт**: Бүтээсэн анимациа бие даасан HTML файл эсвэл статик SVG хэлбэрээр татаж авч, өөрийн вэбсайт эсвэл аппликейшнд шууд ашиглах боломжийг олгодог.
- **Хэрэглэгчийн удирдлага**: Firebase ашиглан өөрийн гэсэн профайл үүсгэж, хийсэн бүх бүтээлүүдээ түүх (History) хэлбэрээр хадгалж, захиалгат багцаа (Free/Pro) удирдах боломжтой.

### AetherMotion юунд зориулагдсан бэ?
Энэхүү платформ нь вэб дизайнерууд, фронт-энд хөгжүүлэгчид болон бүтээлч инженерүүдэд зориулагдсан. Нарийн төвөгтэй вектор анимаци хийхэд зарцуулдаг олон цагийн ажлыг хэдхэн секунд болгон товчилж, вэб сайтыг илүү амьд, орчин үеийн, "кино" мэт чанартай харагдуулах хөдөлгөөнт графикуудыг бүтээхэд туслах зорилготой юм.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **AI Orchestration**: [Firebase Genkit](https://firebase.google.com/docs/genkit)
- **Database & Auth**: [Firebase (Firestore & Authentication)](https://firebase.google.com/)
- **Animation Engine**: [GSAP (GreenSock Animation Platform)](https://greensock.com/gsap/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [ShadCN UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Firebase**:
   Update `src/firebase/config.ts` with your project credentials.

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Run Genkit UI (Optional)**:
   ```bash
   npm run genkit:dev
   ```
