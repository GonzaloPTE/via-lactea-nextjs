/**
 * Utility functions for handling HubSpot newsletter subscriptions
 */

/**
 * Subscribes an email to the newsletter in HubSpot
 * @param email Email address to subscribe
 * @returns Object with success status and optional error message
 */
export async function subscribeToNewsletter(email: string): Promise<{ success: boolean; message?: string }> {
  try {
    // Validate email
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return { success: false, message: 'Email inválido' };
    }
    
    // HubSpot API integration - list ID
    const listId = '11'; // ID ILS específico para la lista de suscriptores
    
    // Get HubSpot API key from environment variable
    const hubspotApiKey = process.env.HUBSPOT_API_KEY;
    
    if (!hubspotApiKey) {
      console.error('HUBSPOT_API_KEY is not defined in environment variables');
      return { success: false, message: 'Error de configuración del servidor' };
    }

    // Search for contact by email to get its ID
    const searchContactResponse = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${hubspotApiKey}`
      },
      body: JSON.stringify({
        filterGroups: [
          {
            filters: [
              {
                propertyName: 'email',
                operator: 'EQ',
                value: email
              }
            ]
          }
        ]
      })
    });

    const searchData = await searchContactResponse.json();
    let contactId;
    
    if (!searchContactResponse.ok || searchData.total === 0) {
      // Contact doesn't exist, create it with 'subscriber' lifecycle stage
      const createResponse = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${hubspotApiKey}`
        },
        body: JSON.stringify({
          properties: {
            email: email,
            lifecyclestage: 'subscriber'
          }
        })
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        console.error('Error creating contact in HubSpot:', errorData);
        return { success: false, message: 'Error al crear contacto en HubSpot' };
      }
      
      const contactData = await createResponse.json();
      contactId = contactData.id;
    } else {
      // Contact exists, get its ID
      contactId = searchData.results[0].id;
    }
    
    // Add contact to the specified list 
    const addToListResponse = await fetch(`https://api.hubapi.com/crm/v3/lists/${listId}/memberships/add`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${hubspotApiKey}`
      },
      body: JSON.stringify([contactId])
    });

    if (!addToListResponse.ok) {
      const errorData = await addToListResponse.json();
      console.error('Error adding contact to list in HubSpot:', errorData);
      return { success: false, message: 'Error al añadir contacto a la lista' };
    }

    // Return success
    return { success: true };
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return { success: false, message: 'Por favor, inténtalo de nuevo.' };
  }
} 