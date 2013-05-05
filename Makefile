db-init:
	@echo "Create and Migrate database..."
	@mysql -u root -e 'DROP DATABASE IF EXISTS chat;'
	@mysql -u root -e 'CREATE DATABASE chat DEFAULT CHARACTER SET utf8;'
	@db-migrate -c migrations/local.conf

db:
	@echo "Migrate database..."
	@db-migrate -c migrations/local.conf

start:
	@echo "Running (Tornado + WebSockets = Chat Web App)..."
	@cd chat && python server.py
