const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Todo API',
      version: '1.0.0',
      description: 'API Διαχείρισης Εργασιών (Todos)',
    },
    servers: [
      { url: 'http://localhost:3000' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
    
    
    paths: {
      //AUTH ENDPOINTS 
      '/signup': {
        post: {
          summary: 'Εγγραφή νέου χρήστη',
          tags: ['Auth'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'password'],
                  properties: {
                    name: { type: 'string' },
                    email: { type: 'string' },
                    password: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            201: { description: 'Ο χρήστης δημιουργήθηκε' },
            400: { description: 'Σφάλμα' }
          }
        }
      },
      '/auth/login': {
        post: {
          summary: 'Σύνδεση χρήστη',
          tags: ['Auth'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string' },
                    password: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Επιτυχής σύνδεση' },
            401: { description: 'Λάθος στοιχεία' }
          }
        }
      },
      '/auth/logout': {
        get: {
          summary: 'Αποσύνδεση',
          tags: ['Auth'],
          responses: {
            200: { description: 'Αποσυνδέθηκε' }
          }
        }
      },
      //TODO ENDPOINTS
      '/todos': {
        get: {
          summary: 'Λήψη όλων των λιστών',
          tags: ['Todos'],
          responses: {
            200: { description: 'Λίστα Todos' }
          }
        },
        post: {
          summary: 'Δημιουργία νέας λίστας',
          tags: ['Todos'],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { title: { type: 'string' } }
                }
              }
            }
          },
          responses: {
            201: { description: 'Δημιουργήθηκε' }
          }
        }
      },
      '/todos/{id}': {
        get: {
          summary: 'Λήψη μίας λίστας',
          tags: ['Todos'],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'OK' } }
        },
        put: {
          summary: 'Ενημέρωση λίστας',
          tags: ['Todos'],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { title: { type: 'string' }, completed: { type: 'boolean' } }
                }
              }
            }
          },
          responses: { 200: { description: 'Ενημερώθηκε' } }
        },
        delete: {
          summary: 'Διαγραφή λίστας',
          tags: ['Todos'],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Διαγράφηκε' } }
        }
      },
      '/todos/{id}/items': {
        post: {
          summary: 'Προσθήκη Item',
          tags: ['Todos'],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { text: { type: 'string' } }
                }
              }
            }
          },
          responses: { 201: { description: 'Προστέθηκε' } }
        }
      },
      '/todos/{id}/items/{itemId}': {
        put: {
          summary: 'Ενημέρωση Item',
          tags: ['Todos'],
          parameters: [
            { in: 'path', name: 'id', required: true, schema: { type: 'string' } },
            { in: 'path', name: 'itemId', required: true, schema: { type: 'string' } }
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { text: { type: 'string' }, completed: { type: 'boolean' } }
                }
              }
            }
          },
          responses: { 200: { description: 'Ενημερώθηκε' } }
        },
        delete: {
          summary: 'Διαγραφή Item',
          tags: ['Todos'],
          parameters: [
            { in: 'path', name: 'id', required: true, schema: { type: 'string' } },
            { in: 'path', name: 'itemId', required: true, schema: { type: 'string' } }
          ],
          responses: { 200: { description: 'Διαγράφηκε' } }
        }
      }
    }
  },
  // Σβήνουμε το apisγιατί τα γράψαμε όλα εδώ μέσα
  apis: [], 
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;