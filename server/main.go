package main

import (
	"database/sql"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"

	_ "github.com/lib/pq"
)


var db  *sql.DB

type Todo struct {
	Id uint `json:"id"`
	Title string `json:"title"`
	Body string `json:"body"`
	Done bool `json:"done"`
}

func todos() []Todo {
	todos := []Todo{}

	rows, err := db.Query(`SELECT id, title, body, done FROM todo ORDER BY id`)

	if err != nil {
		log.Fatal(err)
	}

	var id uint
	var title string
	var body string
	var done bool

	for rows.Next() {
		err := rows.Scan(&id, &title, &body, &done)
		if err != nil {
			log.Fatal(err)
		}
		todos = append(todos, Todo{id, title, body, done})
	}

	return todos
}


func init() {
	var err error

	err = godotenv.Load()

	if err != nil {
		log.Fatal(err)
	}

	db, err = sql.Open("postgres", os.Getenv("DATABASE_URI"))

	if err != nil {
		log.Fatal(err)
	}

	if err = db.Ping(); err != nil {
		log.Fatal(err)
	}

	_, err = db.Exec(`
	CREATE TABLE IF NOT EXISTS todo (
		id SERIAL PRIMARY KEY,
		title TEXT NOT NULL,
		body TEXT,
		done BOOLEAN DEFAULT false,
		created timestamp DEFAULT NOW()
			)`)

	if err != nil {
		log.Fatal(err)
	}
}

func main() {

	defer db.Close()

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: os.Getenv("Origin"), 
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	app.Post("/api/todos", func(c *fiber.Ctx) error { 
		todo := &Todo{} 
		
		if err := c.BodyParser(todo); err != nil {
			return err
		}

		db.Exec(`INSERT INTO todo (title, body) VALUES ($1, $2) `, todo.Title, todo.Body)

		return c.JSON(todos())
	})

	app.Patch("/api/todos/:id/done", func(c *fiber.Ctx) error {
		id, err := c.ParamsInt("id")
		if err != nil {
			return c.Status(401).SendString("Invalid id")
		}

		_, err = db.Exec("UPDATE todo SET done = true WHERE id = $1", id)

		if err != nil {
			log.Fatal(err)
		}

		return c.JSON(todos())
	})

	app.Patch("/api/todos/:id/undone", func(c *fiber.Ctx) error {
		id, err := c.ParamsInt("id")
		if err != nil {
			return c.Status(401).SendString("Invalid id")
		}

		_, err = db.Exec("UPDATE todo SET done = false WHERE id = $1", id)

		
		if err != nil {
			log.Fatal(err)
		}

		return c.JSON(todos())
	})

	app.Get("/api/todos", func(c *fiber.Ctx) error {
		return c.JSON(todos())
	})

	app.Delete("/api/todos/:id", func(c *fiber.Ctx) error {
		id, err := c.ParamsInt("id")
		if err != nil {
			return c.Status(401).SendString("Invalid id")
		}
		_, err = db.Exec("DELETE FROM todo WHERE id = $1", id)

		if err != nil {
			log.Fatal(err)
		}

		return c.JSON(todos())
	}) 


	log.Fatal(app.Listen(os.Getenv("PORT")))
}
