export class Task {
  constructor(id, content, username, status = 'pending', createdAt = new Date()) {
    this.id = id;
    this.content = content;
    this.username = username;
    this.status = status;
    this.createdAt = createdAt;
  }

  toggleStatus() {
    this.status = this.status === 'pending' ? 'done' : 'pending';
  }
}

