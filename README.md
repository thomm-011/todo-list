# 📝 Todo List - Microsoft To Do Style

Uma aplicação de lista de tarefas moderna e responsiva inspirada no Microsoft To Do, desenvolvida com HTML, CSS e JavaScript vanilla.

## 🌐 Demo ao Vivo

**Acesse o projeto:** [http://thomas-todo-list-app.s3-website-us-east-1.amazonaws.com](http://thomas-todo-list-app.s3-website-us-east-1.amazonaws.com)

## ✨ Funcionalidades

### 🎯 Principais
- ✅ **Adicionar tarefas** com título e notas
- ✅ **Marcar como concluída** com som de notificação
- ✅ **Editar tarefas** existentes
- ✅ **Excluir tarefas** individualmente
- ✅ **Persistência de dados** no localStorage

### 🔧 Avançadas
- 🌙 **Tema escuro/claro** alternável
- 📱 **Design responsivo** para mobile e desktop
- 🔔 **Sistema de lembretes** com data e hora
- 📋 **Subtarefas** organizadas
- 🎵 **Feedback sonoro** ao completar tarefas
- 💾 **Armazenamento local** automático

## 🛠️ Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Estilização moderna com Flexbox
- **JavaScript ES6+** - Lógica da aplicação
- **Tailwind CSS** - Framework CSS utilitário
- **LocalStorage API** - Persistência de dados
- **Web Audio API** - Efeitos sonoros

## 🚀 Como Usar

### 1. Clone o repositório
```bash
git clone https://github.com/thomm-011/todo-list.git
cd todo-list
```

### 2. Abra no navegador
```bash
# Opção 1: Abrir diretamente
open index.html

# Opção 2: Servidor local (recomendado)
python -m http.server 8000
# Acesse: http://localhost:8000
```

### 3. Comece a usar!
- Digite uma tarefa no campo de entrada
- Pressione Enter ou clique em "Adicionar"
- Clique no checkbox para marcar como concluída
- Use os botões de ação para editar ou excluir

## 📁 Estrutura do Projeto

```
todo-list/
├── index.html          # Página principal
├── styles.css          # Estilos customizados
├── app.js             # Lógica da aplicação
├── plin.mp3           # Som de notificação
├── README.md          # Documentação
└── .gitattributes     # Configurações Git
```

## 🎨 Interface

### Tema Claro
- Interface limpa e minimalista
- Cores suaves e contrastes adequados
- Ícones intuitivos

### Tema Escuro
- Reduz fadiga visual
- Ideal para uso noturno
- Transições suaves entre temas

## 💡 Funcionalidades Detalhadas

### ➕ Adicionar Tarefas
- Campo de entrada intuitivo
- Suporte a notas adicionais
- Validação de entrada

### ✏️ Editar Tarefas
- Edição inline
- Preserva formatação
- Salva automaticamente

### 🔔 Sistema de Lembretes
- Definir data e hora
- Notificações visuais
- Persistência de lembretes

### 📋 Subtarefas
- Organização hierárquica
- Progresso visual
- Gerenciamento independente

## 🌐 Deploy

### AWS S3 (Atual)
O projeto está hospedado no Amazon S3 como site estático:
- **Bucket**: `thomas-todo-list-app`
- **URL**: http://thomas-todo-list-app.s3-website-us-east-1.amazonaws.com
- **Configuração**: Hospedagem estática habilitada

### Deploy Local
Para hospedar localmente:
```bash
# Com Python
python -m http.server 8000

# Com Node.js
npx serve .

# Com PHP
php -S localhost:8000
```

## 🔧 Configuração de Desenvolvimento

### Pré-requisitos
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Editor de código (VS Code recomendado)

### Extensões VS Code Recomendadas
- Live Server
- Prettier
- ES6 String HTML
- Auto Rename Tag

## 📱 Responsividade

- **Mobile First**: Otimizado para dispositivos móveis
- **Breakpoints**: Adaptação automática para tablets e desktop
- **Touch Friendly**: Botões e áreas de toque adequadas

## 🎵 Recursos de Áudio

- **Som de conclusão**: Feedback auditivo ao completar tarefas
- **Arquivo**: `plin.mp3` (33KB)
- **Controle**: Pode ser desabilitado pelo usuário

## 💾 Armazenamento de Dados

- **LocalStorage**: Dados salvos no navegador
- **Formato**: JSON estruturado
- **Persistência**: Dados mantidos entre sessões
- **Backup**: Recomendado export/import manual

## 🐛 Resolução de Problemas

### Dados não salvam
- Verifique se o localStorage está habilitado
- Limpe o cache do navegador
- Teste em modo privado/incógnito

### Som não funciona
- Verifique se o arquivo `plin.mp3` existe
- Teste em diferentes navegadores
- Verifique configurações de áudio do sistema

### Layout quebrado
- Verifique conexão com Tailwind CSS CDN
- Teste sem extensões do navegador
- Limpe cache e cookies

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

**Thomas** - [GitHub](https://github.com/thomm-011)

## 🙏 Agradecimentos

- Inspiração: Microsoft To Do
- Ícones: Heroicons
- CSS Framework: Tailwind CSS
- Hospedagem: Amazon S3

---

⭐ Se este projeto foi útil para você, considere dar uma estrela no repositório!
