export default class Validation {
  // Propriedade pública que armazena se a validação foi bem-sucedida (true) ou não (false).
  success: boolean;
  // Propriedade pública que armazena uma mensagem de erro, se houver falha, ou uma string vazia em caso de sucesso.
  message: string;

  /**
   * Creates a new Validation object
   * @param success if the validation was successful
   * @param message The validation message, if validation failed
   */
  // Construtor da classe Validation.
  // Define 'success' como 'true' e 'message' como string vazia por padrão.
  constructor(success: boolean = true, message: string = "") {
    // Inicializa a propriedade success.
    this.success = success;
    // Inicializa a propriedade message.
    this.message = message;
  }
}
